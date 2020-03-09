import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fib = () => {
    const [seenIndexes, setSeenIndexes] = useState([]),
        [values, setValues] = useState({}),
        [index, setIndex] = useState('');


    const renderSeenIndexes = () => seenIndexes.map(({ number }) => number).join(', ');

    const renderCalculatedValues = () => {
        const entries = [];

        Object.keys(values).forEach((key) => {
            entries.push(
                <div key={key}>
                    For index {key}, I have calculated {values[key]}
                </div>
            );
        });

        return entries;
    }

    const fetchValues = async () => {
        const values = await axios.get('/api/values/current');
        setValues(values.data);
    };

    const fetchIndexes = async () => {
        const seenIndexes = await axios.get('/api/values/all');
        setSeenIndexes(seenIndexes.data);
    }

    const handleSubmit = async event => {
        event.preventDefault();

        await axios.post('/api/values', {
            index
        });

        setIndex('');
    }

    useEffect(() => {
        fetchValues();
        fetchIndexes();
    }, []);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your index:</label>
                <input value={index} onChange={({ target: { value } }) => setIndex(value)} />
                <button type="submit">Submit</button>
            </form>

            <h3>Indexes I have seen:</h3>
            {renderSeenIndexes()}
            <h3>Calculated values:</h3>
            {renderCalculatedValues()}
        </div>
    );
};

export default Fib;