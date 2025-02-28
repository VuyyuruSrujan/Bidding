import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Hash "mo:base/Hash";
import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Random "mo:base/Random";
import Nat8 "mo:base/Nat8";

actor {
  public type userDetails = {
    prin : Principal;
    name : Text;
    age : Nat64;
    mail : Text;
    dob : Text;
  };

  var bid_id : Int = 0;
  public type create_auction = {
    title : Text;
    description : Text;
    image : Blob;
    starting_bid : Nat64;
    end_date : Text;
    prin : Principal;
  };

  public type bid_details = {
    title : Text;
    description : Text;
    image : Blob;
    starting_bid : Nat64;
    end_date : Text;
    prin : Principal;
    bidding_id : Int;
    status : Text;
    no_of_bids : Int;
  };

  public type bidding_trans = {
    prin : Principal;
    id : Int;
    amount : Nat64;
    time : Time.Time;
    txn_hhash : Text;
  };

  var users = HashMap.HashMap<Principal, userDetails>(0, Principal.equal, Principal.hash);

  var create_auc_hash = HashMap.HashMap<Int, bid_details>(0, Int.equal, Int.hash);

  var txn_data : [bidding_trans] = [];

  // Store used hashes to ensure uniqueness
  var used_hashes : [Text] = [];

  public func generateUniqueHash(principal : Principal, id : Int, amount : Nat64) : async Text {
    var unique = false;
    var hash = "";

    while (not unique) {
      let randomBlob = await Random.blob(); // Generate a random blob
      let randomBytes = Blob.toArray(randomBlob); // Convert blob to an array of Nat8
      let randomStr = Array.foldLeft<Nat8, Text>(
        randomBytes,
        "",
        func(acc, byte) {
          acc # Int.toText(Nat8.toNat(byte)); // Convert Nat8 to Nat before converting to text
        },
      );

      let timestamp = Time.now();
      // let rawString = Principal.toText(principal) # "-" # Int.toText(id) # "-" # Nat64.toText(amount) # "-" # Int.toText(timestamp) # "-" # randomStr;
      let rawString = Principal.toText(principal) # Int.toText(id) # Nat64.toText(amount) # Int.toText(timestamp) # randomStr;
      hash := rawString;

      if (Array.find<Text>(used_hashes, func(existing) { existing == hash }) == null) {
        unique := true;
        used_hashes := Array.append<Text>(used_hashes, [hash]);
      };
    };
    return hash;
  };

  public func set_user(details : userDetails) : async Int {
    users.put(details.prin, details);
    return 1;
  };

  public shared query func get_user(prin : Principal) : async ?userDetails {
    var isuser = users.get(prin);
    switch (isuser) {
      case (?_found) { return isuser };
      case (null) { return null };
    };
  };

  public func remove_all_users() : async Text {
    users := HashMap.HashMap<Principal, userDetails>(0, Principal.equal, Principal.hash);
    return "deleted";
  };

  public func set_bid(details : create_auction) : async Text {
    var check_profile = await get_user(details.prin);
    if (check_profile != null) {
      bid_id += 1;
      let newBid = {
        title = details.title;
        description = details.description;
        image = details.image;
        starting_bid = details.starting_bid;
        end_date = details.end_date;
        prin = details.prin;
        bidding_id = bid_id;
        status = "Active";
        no_of_bids = 0;
      };
      create_auc_hash.put(newBid.bidding_id, newBid);
      return "added";
    } else {
      return "not registered";
    };
  };

  public shared query func get_biddings() : async [bid_details] {
    return Iter.toArray(create_auc_hash.vals());
  };

  public shared query func get_biddings_by_principal(prin : Principal) : async [bid_details] {
    let all_biddings = Iter.toArray(create_auc_hash.vals());
    let filtered_biddings = Array.filter<bid_details>(all_biddings, func(bid) { bid.prin == prin });
    return filtered_biddings;
  };

  public shared query func get_biddings_by_id(id : Int) : async ?bid_details {
    create_auc_hash.get(id);
  };

  public func update_bidd(principal : Principal, id : Int, amount : Nat64) : async Nat64 {
    var data = create_auc_hash.get(id);
    switch (data) {
      case (?found) {
        if (found.status == "Active") {
          let updated_no_of_bids = found.no_of_bids + 1;
          let newBid = {
            title = found.title;
            description = found.description;
            image = found.image;
            starting_bid = amount;
            end_date = found.end_date;
            prin = found.prin;
            bidding_id = found.bidding_id;
            status = "Active";
            no_of_bids = updated_no_of_bids;
          };

          Debug.print(debug_show (newBid));
          create_auc_hash.put(id, newBid);

          // Generate unique transaction hash
          let txn_hash = await generateUniqueHash(principal, id, amount);

          let trans = {
            prin = principal;
            id = id;
            amount = amount;
            time = Time.now();
            txn_hhash = txn_hash;
          };

          txn_data := Array.append<bidding_trans>(txn_data, [trans]);

          return newBid.starting_bid;
        } else {
          return 0; // Auction is not active
        };
      };
      case (null) {
        return 0; // Auction ID does not exist
      };
    };
  };

  public shared query func get_trans() : async [bidding_trans] {
    return txn_data;
  };

  public shared query func remove_all_bids() : async Text {
    create_auc_hash := HashMap.HashMap<Int, bid_details>(0, Int.equal, Int.hash);
    return "deleted";
  };

  public shared query func get_my_titles(prin : Principal) : async [Text] {
    let all_biddings = Iter.toArray(create_auc_hash.vals());
    let filtered_titles = Array.map<bid_details, Text>(
      Array.filter<bid_details>(all_biddings, func(bid) { bid.prin == prin }),
      func(bid) { bid.title },
    );
    return filtered_titles;
  };

  public func get_tnx_by_id(search_id : Int) : async [bidding_trans] {
    return Array.filter<bidding_trans>(txn_data, func(txn) { txn.id == search_id });
  };

  public func end_auction(id : Int) : async ?create_auction {
    var data = create_auc_hash.get(id);
    switch (data) {
      case (?found) {
        let newBid = {
          title = found.title;
          description = found.description;
          image = found.image;
          starting_bid = found.starting_bid;
          end_date = found.end_date;
          prin = found.prin;
          bidding_id = found.bidding_id;
          status = "Ended";
          no_of_bids = found.no_of_bids;
        };
        Debug.print(debug_show (newBid));
        create_auc_hash.put(id, newBid);

        return ?newBid;
      };
      case (null) { null };
    };
  };

};
