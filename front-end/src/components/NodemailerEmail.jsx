import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NodemailerEmail = (props) => {
  const [emailCustomer, setEmail] = useState('amneeshsingh@icloud.com');
  const [subject, setSubject] = useState('2');
  const [message, setMessage] = useState('3');
  const [emailSent, setEmailSent] = useState(false);
  const [status, setStatus] = useState('');
  console.log(props + "test");
  const email = ['a511@mylangara.ca'];
  const baseUrl = 'http://localhost:6982';

  const handleSendEmail = async () => {
    const dataSend = {
      email,
      subject,
      message,
    };

    try {
      const response = await axios.post(`${baseUrl}/email/sendemail`, dataSend);
      console.log('Response:', response.data);
      if (response.data.message === 'Email sent successfully') {
        setEmailSent(true);
        alert('Email sent successfully');
      } else {
        console.error(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };



  return (
    <div>
      <h1>Send Email</h1>
      {emailSent ? (
        <p>Email sent successfully!</p>
      ) : (
        <form>
          <label for="email">
            :
          </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <br />
          <label>
            Subject:
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </label>
          <br />
          <label>
            Message:
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
          <br />
          <button type="button" onClick={handleSendEmail}>
            Send Email
          </button>

          <p>Status: {status}</p>
        </form>
      )}
    </div>
  );
};

export default NodemailerEmail;