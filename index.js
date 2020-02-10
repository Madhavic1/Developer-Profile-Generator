const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const axios = require("axios");
const pdf = require('html-pdf');
const generateHtml = require('./generateHTML')
const writeFileAsync = util.promisify(fs.writeFile);
const readFileSync = util.promisify(fs.readFile);
var options = {format : 'Letter'};


/**
 * Project flow:
 * 1. Ask the user for his favorite color
 * 2. pass the color as an argument  
 * 3. get the response from GitHUB API   (in generateHTML.js file)
 * 4. Use the below details from the API response: 
 * profile pic URL ,location , github URL , user blog ,number of public repositories , Followers , Git hub stars , Following count 
 * while generating the html page  by calling generateHTML() , with color as an argument.
 */
function geoLocation()
{
    return new Promise(function(resolve,reject){
        if(!navigator.geoLocation)
        {
            //if this , geolocation is not supported , this function rejects the give the coordinates, by returning reject().
           return reject('Geolocation is not supported by this browser');
        }
        //if success , this function promises to return the position object , which gives cordinates of user location.
        navigator.geolocation.getCurrentPosition(resolve(position));
    });
}

function getGitHubUserInfo()
{
const queryUrl = 'https://api.github.com/users/Madhavic1';
return axios.get(queryUrl);
}

function getGithubRepoStars(queryUrl)
{
return  axios.get(queryUrl);
// .then( response =>{
//      var stcount  
//     for(let i=0;i<response.data.length;i++)
//         {
//             starCount+=response.data[i].stargazers_count;
//         } 
//     });
}
async function init() {
    try {
        //asking the user for his fav color ro use it in html
        // const location = await geoLocation();
        // console.log(location);
        
        var starCount = 0 ;
        var userProfile = await getGitHubUserInfo();
        var gitHubRepoInfo = await getGithubRepoStars(userProfile.data.repos_url);
        for(let i=0;i<gitHubRepoInfo.data.length;i++)
        {
            starCount+=gitHubRepoInfo.data[i].stargazers_count;
        }
        //console.warn(gitHubStarCount);
        
        const answer = await inquirer.prompt([
            {
                type: 'list',
                message: 'What is your favorite color?',
                name: 'color',
                choices: [
                    'green',
                    'blue',
                    'pink',
                    'red'
                ]
            }
        ]); //prompts the user for his fav color -- should be pulled from generateHTML.js 

        var gitHubData = {
            public_repos : userProfile.data.public_repos,
            followers : userProfile.data.followers,
            following : userProfile.data.following,
            color : answer.color,
            githubStars : starCount,
            profile_image : userProfile.data.avatar_url,
            gitHub_Url : userProfile.data.html_url,
            blog : userProfile.data.blog
        }
        console.log(gitHubData);
        const html = await generateHtml.generateHTML(gitHubData); // generates the html page -- should be pulled from generateHTML.js 
        await writeFileAsync('profile.html', html);
        var readHtml = await readFileSync('profile.html', 'utf8');
        pdf.create(readHtml, options).toFile('./profile.pdf', function (err, res) {
            if (err) return console.log(err);
            console.log(res);
        });
    } catch (err) {
        console.log(err);

    }
}

init();