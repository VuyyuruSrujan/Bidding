import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGavel, FaImage, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './CreateBid.css'
import { Principal } from '@dfinity/principal';
import { Bidding_ICP_backend } from '../../../declarations/Bidding_ICP_backend';

function CreateBid() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [formData, setFormData] = useState("");
  const [previewUrl, setPreviewUrl] = useState('');
  const[Title , setTitle] = useState("");
  const [Description , setDescription] = useState("");
  const [image , setimage] = useState("");
  const [start_bid , setstart_bid] = useState();
  const [End_date , set_End_date] = useState();
  var principal = localStorage.getItem("principal");

  const handleImageChange = (e) => {
    const reader = new FileReader();
    console.log("first")
    reader.onloadend = async () => {
      const uri = reader.result;
      console.log(uri)
      const binary = convertDataURIToBinary(uri);
      setimage(binary);
    };
    reader.readAsDataURL(e.target.files[0])
  };

  const convertDataURIToBinary = dataURI =>
    Uint8Array.from(window.atob(dataURI.replace(/^data[^,]+,/, '')), v => v.charCodeAt(0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    var create_auction = {
      title:Title,
      description:Description,
      image:image,
      starting_bid:BigInt(start_bid),
      end_date:End_date,
      prin:Principal.fromText(principal),
    };
    var result = await Bidding_ICP_backend.set_bid(create_auction);
    console.log("storing bidding",result);
    if(result == "added"){
      alert("bidding started");
      window.location.reload();
    }else{
      alert(result);
      navigate('/profile');
    }
  };

  return (
    <div className="create-bid">
      <motion.div
        className="create-bid-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="form-header">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FaGavel /> Create New Auction
          </motion.h1>
          <p>List your item for others to bid on</p>
        </div>

        <form onSubmit={handleSubmit}>
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              className="form-control"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-control"
              rows="4"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label>Item Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="image-input"
              required
            />
            <div
              className={`image-preview ${!previewUrl ? 'empty' : ''}`}
              onClick={() => document.getElementById('image-input').click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" />
              ) : (
                <div className="preview-text">
                  <FaImage /> Click to upload image
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="form-row"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="form-group">
              <label htmlFor="startingBid">Starting Bid ($)</label>
              <input
                type="number"
                id="startingBid"
                className="form-control"
                min="0"
                step="0.01"
                onChange={(e) => setstart_bid(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="datetime-local"
                id="endDate"
                className="form-control"
                onChange={(e) => set_End_date(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="loading-spinner" /> Creating Auction...
              </>
            ) : (
              <>
                <FaGavel /> Create Auction
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateBid;