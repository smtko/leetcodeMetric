document.addEventListener("DOMContentLoaded", function() {

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const bodyEle = document.querySelector('.container');

    function validateUsername(username)
    {
        if(username.trim() === "")
        {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,20}$/;
        const isMAtching = regex.test(username);
        return isMAtching;
    }

    async function fetchUserDetails(username)
    {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try
        {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true; 
            const response = await fetch(url);
            if(!response.ok)
            {
                throw new Error("Unable to fetch data");
            }
            const parsedData = await response.json();
            console.log("Login data: ", parsedData);
            displayUserData(parsedData);
        }
        catch(error)
        {
            statsContainer.innerHTML = `<p>${error.message}</p>`;
        }
        finally
        {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle)
    {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function updateCard(solvedTotal, acceptanceRate, ranking)
    {
        const card1 = document.createElement('div');
        card1.innerHTML = 
        `
            <p>Total Solved Questions:</p>
            <p>${solvedTotal}</p>
        `;
        const card2 = document.createElement('div');
        card2.innerHTML = 
        `
            <p>Acceptance Rate: </p>
            <p>${acceptanceRate}</p>
        `;
        const card3 = document.createElement('div');
        card3.innerHTML = 
        `
            <p>Ranking: </p>
            <p>${ranking}</p>
        `;
        card1.classList.add('card');
        card2.classList.add('card');
        card3.classList.add('card');
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('cardsContainer');
        cardDiv.appendChild(card1);
        cardDiv.appendChild(card2);
        cardDiv.appendChild(card3);
        bodyEle.appendChild(cardDiv);
    }

    function displayUserData(parsedData)
    {
        const totalHard = parsedData.totalHard;
        const totalMedium = parsedData.totalMedium;
        const totalEasy = parsedData.totalEasy;
        const totalQuestions = parsedData.totalQuestions;

        const solvedEasy = parsedData.easySolved;
        const solvedMedium = parsedData.mediumSolved;
        const solvedHard = parsedData.hardSolved;
        const solvedTotal = parsedData.totalSolved;

        const acceptanceRate = parsedData.acceptanceRate;
        const ranking = parsedData.ranking;

        updateProgress(solvedEasy, totalEasy, easyLabel, easyProgressCircle);
        updateProgress(solvedMedium, totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(solvedHard, totalHard, hardLabel, hardProgressCircle);

        updateCard(solvedTotal, acceptanceRate, ranking);
    }  


    searchButton.addEventListener('click', () => {
        const username = usernameInput.value;
        console.log("Login username: " + username);
        if(validateUsername(username))
        {
            fetchUserDetails(username);
        }
        bodyEle.removeChild(bodyEle.lastChild);
    });
});