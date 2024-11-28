import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';


const EmailInvitationForm = () => {
    //  const urlParams = new URLSearchParams(window.location.search);
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };
    const query = useQuery();

    const [name, setName] = useState('');
    const [email, setEmail] = useState( '');
    const [status, setStatus] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [emailParam, setEmailParam] = useState('');

    const [formShow, setFormShow] = useState(true);

    useEffect(() => {
        const nameFromQuery = query.get('name') || '';
        const emailFromQuery = query.get('email') || '';
        setName(nameFromQuery);
        setEmail(emailFromQuery);
    }, [query]); // Run this effect whenever the query changes

   

    const emailChanger = (event) => {
        setEmailParam(event.target.value);
        setEmail(event.target.value);

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:6982/send-message', {
                name,
                email,
                status,
            });
            const data = response.data;
            console.log(response);
            if (data.error) {
                setError(data.error);
                setFormShow(true);
            } else {
                setFormShow(false);
                setSuccess('Thank You for response!');
                setName('');
                setEmail('');
                setStatus('');
            }
        } catch (error) {
            setError('Error sending message');
        }
    };


    return (
        <div className='invitationForm'>
            {formShow ?
                <form onSubmit={handleSubmit} className='invitation-form'>

<br />
<br />
<br />
                    <h1>Hey {name}, Please do the RSVP</h1>
                    {/* <label>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </label> */}
                    <br />
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email || ''}
                            onChange={emailChanger}
                        />
                    </label>
                    <br />
             
            
                    <div className='form-buttons'>
                        <button type='submit' id='accept' onClick={() => { setStatus('accepted') }}>Accept Proposal</button>
                        <button type='submit' id='reject' onClick={() => { setStatus('rejected') }}>Reject Proposal</button>
                        <button type='submit' id='tentative' onClick={() => { setStatus('tentative') }}>Tentative</button>
                    </div>
                    <br />
                    {/* <button type="submit">Send Message</button> */}

                </form>
                : <></>}

            <div className='message-confirmation'>
                {error && <p style={{ color: 'red' }}>{error}. Please try again.</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </div>
        </div>
    );
};

export default EmailInvitationForm;