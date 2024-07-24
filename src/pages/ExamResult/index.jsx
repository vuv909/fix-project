import React, { useEffect, useState } from 'react';
import restClient from '../../services/restClient';
import { useParams } from 'react-router-dom';

const Index = () => {
  const [score, setScore] = useState(null); // Initialize score state to null or appropriate initial value
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await restClient({
          url: `api/userexam/getlistresultexamofuserbyuserid/${id}`,
          method: 'GET',
        });
        console.log(response.data); // Assuming response contains data property with score
        setScore(response.data); // Set score state with the fetched data
        // You can add toast notification here for successful data fetch
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error with toast notification or other error handling
      }
    };

    fetchData();
  }, [id]); // Add id to dependency array to fetch data whenever id changes

  return (
    <div>
      <h1>Điểm của bạn</h1>
      {score !== null ? (
        <p>Điểm của bạn là: {score}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Index;
