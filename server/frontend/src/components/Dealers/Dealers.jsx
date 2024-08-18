import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);

  const dealer_url = "/djangoapp/get_dealers";  // Updated URL
  
  const filterDealers = async (state) => {
    const dealer_url_by_state = `/djangoapp/get_dealers/${state}`;  // Updated URL
    try {
      const res = await fetch(dealer_url_by_state, {
        method: "GET"
      });
      const retobj = await res.json();
      console.log("Filter Dealers Response:", retobj); // Add detailed logging
      if (retobj.status === 200 && retobj.dealers) {
        setDealersList(retobj.dealers);
      } else {
        console.error("Failed to fetch dealers or no dealers found.");
        setDealersList([]); // Reset the dealers list if no data is found
      }
    } catch (error) {
      console.error("Error filtering dealers by state:", error);
      setDealersList([]); // Handle error by resetting the dealers list
    }
  }

  const get_dealers = async () => {
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();
      console.log("Get Dealers Response:", retobj); // Add detailed logging

      if (res.ok && retobj.status === 200) {
        if (retobj.dealers) {
          const all_dealers = retobj.dealers;
          
          const statesSet = new Set();
          all_dealers.forEach(dealer => {
            if (dealer.state) statesSet.add(dealer.state);
          });

          setStates(Array.from(statesSet));
          setDealersList(all_dealers);
        } else {
          console.error("No dealers found in the response.");
          setDealersList([]); // Reset the dealers list if no data is found
        }
      } else {
        console.error("Failed to fetch dealers:", retobj.message);
        setDealersList([]); // Reset the dealers list in case of failure
      }
    } catch (error) {
      console.error("Error fetching dealers:", error);
      setDealersList([]); // Handle error by resetting the dealers list
    }
  }

  // Fetch dealers when the component mounts
  useEffect(() => {
    get_dealers();
  }, []);

  const isLoggedIn = sessionStorage.getItem("username") != null;

  return (
    <div>
      <Header />
      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select name="state" id="state" onChange={(e) => filterDealers(e.target.value)}>
                <option value="" selected disabled hidden>State</option>
                <option value="All">All States</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>        
            </th>
            {isLoggedIn && <th>Review Dealer</th>}
          </tr>
        </thead>
        <tbody>
          {dealersList.length > 0 ? (
            dealersList.map(dealer => (
              <tr key={dealer.id}>
                <td>{dealer.id}</td>
                <td><a href={`/dealer/${dealer.id}`}>{dealer.full_name}</a></td>
                <td>{dealer.city}</td>
                <td>{dealer.address}</td>
                <td>{dealer.zip}</td>
                <td>{dealer.state}</td>
                {isLoggedIn && (
                  <td>
                    <a href={`/postreview/${dealer.id}`}>
                      <img src={review_icon} className="review_icon" alt="Post Review"/>
                    </a>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No dealers found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dealers;
