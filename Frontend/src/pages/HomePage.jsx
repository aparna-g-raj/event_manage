import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CommentModal from './Comment'; // Correct import path
import '../styles/HomePage.css';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [comments, setComments] = useState({});
  const userId = "currentUserId"; // Replace with actual logic to get the current user's ID

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleLike = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/events/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const updatedEvent = await response.json();
      setEvents(events.map(event => event._id === id ? updatedEvent : event));
    } catch (error) {
      console.error('Error liking event:', error);
    }
  };

  const handleComment = (id) => {
    setSelectedEventId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEventId(null);
  };

  const addComment = (eventId, newComments) => {
    setComments(prevComments => ({
      ...prevComments,
      [eventId]: newComments
    }));
  };

  const deleteComment = (eventId, commentId) => {
    setComments(prevComments => ({
      ...prevComments,
      [eventId]: prevComments[eventId].filter(comment => comment.id !== commentId)
    }));
  };

  return (
    <div className="homepage">
      <img src="/banner.png" alt="Banner" className="homepage-banner" />
      <h1>Upcoming Events</h1>
      <div className="events-list">
        {events.map(event => (
          <div key={event._id} className="event-card">
            <img src={event.image} alt={event.title} className="event-image" />
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <div className="event-actions">
              <button onClick={() => handleLike(event._id)}>
                <img
                  src={event.likedBy.includes(userId) ? "../src/assets/heart-filled.png" : "../src/assets/heart-empty.png"}
                  alt={event.likedBy.includes(userId) ? "liked" : "not liked"}
                />
                {event.likes || 0}
              </button>
              <button onClick={() => handleComment(event._id)}>
                <img src="../src/assets/speech-bubble.png" alt="comment" />
              </button>
              <button>
                <Link to={`/event/${event._id}`} className="button">
                  <img src="../src/assets/visibility.png" alt="view details" />
                </Link>
              </button>
            </div>
          </div>
        ))}
      </div>
      <CommentModal
        open={isModalOpen}
        onClose={handleCloseModal}
        eventId={selectedEventId}
        comments={comments}
        addComment={addComment}
        deleteComment={deleteComment}
      />
    </div>
  );
};

export default HomePage;
