import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:9000/getCompaniesData')
            .then(response => {
                setCompanies(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch companies', error);
            });
    }, []);

    return (
        <div>
            <h1>Companies</h1>
            <ul>
                {companies.map(company => (
                    <li key={company.id}>
                        <Link to={`/companies/${company.name}`}>{company.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CompanyList;