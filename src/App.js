
import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Board from './components/Board/Board';
import { status, priorities } from './utils/data';

function App() {
  // State to hold fetched ticket data
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Retrieve selected group and order from local storage or set defaults
  const defaultGroup = localStorage.getItem('selectedGroup');
  const defaultOrder = localStorage.getItem('selectedOrder');

  // State for grouping and ordering options
  const [group, setGroup] = useState(defaultGroup ? defaultGroup : 'status');
  const [order, setOrder] = useState(defaultOrder ? defaultOrder : 'priority');

  // Function to handle group change, update both state and local storage
  const handleGroupChange = (groupSelected) => {
    setGroup(groupSelected);
    localStorage.setItem("selectedGroup", groupSelected);
  };

  // Function to handle order change, update both state and local storage
  const handleOrderChange = (orderSelected) => {
    setOrder(orderSelected);
    localStorage.setItem("selectedOrder", orderSelected);
  };

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch data from API and set it in state
  const fetchData = async () => {
    try {
      const res = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment ');
      const data = await res.json();
      setTickets(data.tickets); // Set tickets data
      setUsers(data.users);     // Set users data
    } catch (error) {
      console.log("Unable to fetch data! ", error);
    }
  };

  return (
    <div className="App scroll-container">
      {/* Navbar component for group and order selection */}
      <Navbar 
        group={group} 
        order={order} 
        onGroupchange={handleGroupChange} 
        onOrderChange={handleOrderChange} 
      />
      <div className='boards_container'>
        <div className='app_boards'>
          {/* Conditionally render Board components based on the group */}
          {
            group === 'status' && status.map((opt, id) => (
              <Board 
                order={order} 
                data={opt} 
                key={id} 
                tickets={tickets} 
                users={users} 
                group={group} 
              />
            ))
          }
          {
            group === 'user' && users.map((opt) => (
              <Board 
                order={order} 
                data={opt} 
                key={opt.id} 
                tickets={tickets} 
                users={users} 
                group={group} 
                userId={opt?.id} 
              />
            ))
          }
          {
            group === 'priority' && priorities.map((opt, id) => (
              <Board 
                order={order} 
                data={opt} 
                level={id} 
                key={id} 
                tickets={tickets} 
                users={users} 
                group={group} 
              />
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default App;
