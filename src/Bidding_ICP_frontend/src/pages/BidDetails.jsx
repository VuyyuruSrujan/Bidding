import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaGavel, FaClock, FaDollarSign, FaUser, FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './BidDetails.css';
import { Bidding_ICP_backend } from '../../../declarations/Bidding_ICP_backend';
import LoadingDots from './LoadingDots';
import { Principal } from '@dfinity/principal';

function BidDetails() {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [bidAmount, setBidAmount] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [bidDetails, setBidDetails] = useState({});
  const principal = localStorage.getItem('principal');
  const [transactions, settransactions] = useState([]);
  const [winner_prin, setwinner_prin] = useState("");
  const [won_amount, setwon_amount] = useState("");

  useEffect(() => {
    display_winner();
    if (!principal) {
      alert('Connect to Internet Identity first');
    } else {
      getData(Number(id));
      get_tnx();
    }
  }, [id, principal, transactions]);

  async function get_tnx() {
    var data = await Bidding_ICP_backend.get_tnx_by_id(Number(id));
    console.log("tnx data for this id:", data);
    if (data) {
      settransactions(data);
    }
  };

  async function bufferToBase64(buffer) {
    const base64url = await new Promise((r) => {
      const reader = new FileReader();
      reader.onload = () => r(reader.result);
      reader.readAsDataURL(new Blob([buffer]));
    });
    return base64url.slice(base64url.indexOf(',') + 1);
  }

  async function getData(params) {
    try {
      const ans = await Bidding_ICP_backend.get_biddings_by_id(params);
      console.log(ans);
      if (ans) {
        const convertedBids = await Promise.all(
          ans.map(async (bid) => {
            const base64Image = await bufferToBase64(bid.image);
            return { ...bid, imageUrl: `data:image/jpeg;base64,${base64Image}` };
          })
        );
        setBidDetails(convertedBids[0]);
        console.log('Data Principal:', convertedBids[0].prin.toString());
        console.log('Local Principal:', principal);
        if (convertedBids[0].prin.toString() === principal) {
          setIsCreator(true);
        }
      }
    } catch (error) {
      console.error('Error fetching bid details:', error);
    }
  }

  async function handleBid() {
    event.preventDefault();
    (setLoading(true));
    console.log('Placing bid:', bidAmount);
    var ans = await Bidding_ICP_backend.update_bidd(Principal.fromText(principal), Number(id), BigInt(bidAmount));
    console.log("updation:", ans);
    window.location.reload();
  };

  async function display_winner() {
    if (transactions.length === 0) {
      console.log("No transactions available.");
      return;
    }

    const highestBid = transactions.reduce((max, txn) =>
      txn.amount > max.amount ? txn : max
    );

    console.log("Winner Transaction Details:");
    console.log("Amount:", Number(highestBid.amount), "ICP");
    setwon_amount(Number(highestBid.amount))
    console.log("Principal:", highestBid.prin.toString());
    setwinner_prin(highestBid.prin.toString());
    console.log("Timestamp:", convertToIST(highestBid.time));
    console.log("Transaction Hash:", highestBid.txn_hhash);
  }


  async function handleEndAuction() {
    try {
      var data = await Bidding_ICP_backend.end_auction(Number(id))
      console.log('Ending auction:', data);
      if (data) {
        alert("auction ended successfully");
        window.location.reload();
      };
    } catch (error) {
      console.log("error:", error);
    }

  };

  const convertToIST = (epochTime) => {
    const milliseconds = BigInt(epochTime) / BigInt(1000000);
    const date = new Date(Number(milliseconds));
    const formattedDate = date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium',
      timeZone: 'Asia/Kolkata'
    });

    return formattedDate;
  };


  return (
    <div className="bid-details">
      <motion.div
        className="bid-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img
          src={bidDetails?.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image+Available'}
          alt={bidDetails?.title || 'No Title'}
          className="bid-image"
        />

        {loading ? (
          <LoadingDots />
        ) : (
          <></>
        )}

        <div className="bid-content">
          <div className="bid-header">
            <h1 className="bid-title">
              <FaGavel /> {bidDetails?.title || 'No Title Available'}
            </h1>
            <span className={`bid-status status-${bidDetails?.status || 'unknown'}`}>
              {bidDetails?.status === 'Active' ? (
                <>
                  <FaClock /> Active
                </>
              ) : (
                <>
                  <FaCheck /> Ended
                </>
              )}
            </span>
          </div>

          <div className="bid-info">
            <motion.div className="info-card" whileHover={{ scale: 1.05 }}>
              <h3>{Number(bidDetails?.starting_bid) || '0'} ICP</h3>
              <p>Current Bid</p>
            </motion.div>

            <motion.div className="info-card" whileHover={{ scale: 1.05 }}>
              <h3>{Number(bidDetails?.no_of_bids) || '0'}</h3>
              <p>Total Bids</p>
            </motion.div>

            <motion.div className="info-card" whileHover={{ scale: 1.05 }}>
              <h3>{bidDetails?.end_date ? new Date(bidDetails.end_date).toLocaleDateString() : 'N/A'}</h3>
              <p>End Date</p>
            </motion.div>
          </div>

          <div className="bid-description">
            <h2>Description</h2>
            <p>{bidDetails?.description || 'No description available.'}</p>
          </div>

          {bidDetails?.status === 'Active' ? (
            <form onSubmit={handleBid} className="bid-actions">
              {!isCreator ? (
                <>
                  <input
                    type="number"
                    className="bid-input"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={Number(bidDetails?.starting_bid || 0) + 1}
                    step="0.01"
                    placeholder={`Min bid: ICP-${Number(bidDetails?.starting_bid)}`}
                    required
                  />
                  <button type="submit" className="action-btn bid-btn">
                    <FaDollarSign /> Place Bid
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="action-btn end-btn"
                  onClick={handleEndAuction}
                >
                  <FaTimes /> End Auction
                </button>
              )}
            </form>
          ) : (
            <>
              <h1>Winner:</h1><br />
              <p><b> Principal: </b>{winner_prin}</p>
              <p><b>Bid Amount:</b> {won_amount} ICP </p>
            </>
          )}

          <div className="creator-info">
            <img
              src={"data:image/png;base64,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"}
              className="profile-avatar"
            />
            <div>
              <h3>Created by</h3>
              <p>
                <FaUser /> {bidDetails?.prin?.toString() || 'Anonymous'}
              </p>
            </div>
          </div>
          <div>
            <h2 className="transaction-title">Transaction Details</h2>
            {transactions.length > 0 ? (
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>Amount (ICP)</th>
                    <th>Principal</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn, index) => (
                    <tr key={index}>
                      <td>{Number(txn.amount)} ICP</td>
                      <td>{(txn.prin).toString()}</td>
                      <td>{convertToIST(txn.time)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No bidding happened till now.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default BidDetails;
