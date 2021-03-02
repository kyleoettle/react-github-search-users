import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
    const [githubUser, setGithubUser] = useState(mockUser);
    const [repos, setRepos] = useState(mockRepos);
    const [followers, setFollowers] = useState(mockFollowers);
    //request loading
    const [requests, setRequests] = useState(0);
    const [loading, setIsLoading] = useState(false);
    //errors
    const [error, setError] = useState({show:false, msg:""});

    const checkRequests = () => {
        axios(`${rootUrl}/rate_limit`)
        .then(({data}) => {
            let remaining = data.rate.remaining;
            setRequests(remaining);
            if(remaining === 0) {
                toggleError(true, "sorry you have exceeded your hourly reate limit!")
            }
        })
        .catch((ex) => {
            console.log(ex);
        });
    }

    function toggleError(show = false, msg = "") {
        setError({show, msg});
    }

    useEffect(checkRequests, []);
    return (
        <GithubContext.Provider value={{githubUser, repos, followers, requests, error}}>{children}
        </GithubContext.Provider>
    );
};

export { GithubProvider, GithubContext };