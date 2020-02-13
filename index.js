const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const axios = require("axios");
const generateHtml = require('./generateHTML')
var convertFactory = require('electron-html-to');

/**
 * Project flow:
 * 1. Ask the user for his favorite color and github username
 * 2. pass the  github username as an argument to getGitHubUserInfo function 
 * 3. get the response from GitHUB API 
 * 4. Use the API response and user's color choice to generateHtml content
 * 5. Convert the html to pdf using 'electron-html-to' npm package
 */

function getGitHubUserInfo(userName) {
    const queryUrl = `https://api.github.com/users/${userName}`;
    return axios.get(queryUrl);
}

function getGithubRepoStars(queryUrl) {
    return axios.get(queryUrl);
}
async function init() {
    try {
        //asking the user for his fav color ro use it in html
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
            },
            {
                type: 'input',
                message: 'What is your Github username?',
                name: 'userName'
            }
        ]);
        var starCount = 0;
        var userProfile = await getGitHubUserInfo(answer.userName);
        var gitHubRepoInfo = await getGithubRepoStars(userProfile.data.repos_url);

        for (let i = 0; i < gitHubRepoInfo.data.length; i++) {
            starCount += gitHubRepoInfo.data[i].stargazers_count;
        }

        //checking if name is null 
        var name_github = (userProfile.data.name === null) ? answer.userName : `${userProfile.data.name}`;

        //checking if the location is null from github response
        var location_github = (userProfile.data.location === null) ? "" : `<i class="fa fa-location-arrow h4"></i>${userProfile.data.location}`;

        //checking if the comapany is null in the response
        var company_github = (userProfile.data.company === null) ? "" : ("Currently " + userProfile.data.company);

        //checking if the bio is null in the response
        var bio_github = (userProfile.data.bio === null) ? "" : userProfile.data.bio;

        //checking if the blog is null from github response
        var blog_github = (userProfile.data.blog === "") ? "" : `${userProfile.data.blog}`;

        var blog_icon = (userProfile.data.blog === "") ? "" : `<i class="fa fa-blog h4">Blog</i>`;

        var gitHubData = {
            name: name_github,
            company: company_github,
            public_repos: userProfile.data.public_repos,
            followers: userProfile.data.followers,
            following: userProfile.data.following,
            color: answer.color,
            githubStars: starCount,
            profile_image: userProfile.data.avatar_url,
            gitHub_Url: userProfile.data.html_url,
            blog: blog_github,
            blog_icon: blog_icon,
            location_data: location_github,
            location: userProfile.data.location,
            bio: bio_github
        }
        const html = await generateHtml.generateHTML(gitHubData); // generates the html page -- should be pulled from generateHTML.js 
        var conversion = convertFactory({
            converterPath: convertFactory.converters.PDF
        });
        conversion({ html: html }, function (err, result) {
            if (err) {
                return console.error(err);
            }
            result.stream.pipe(fs.createWriteStream('./DeveloperProfile.pdf'));
            conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
        });
    } catch (err) {
        console.log(err);
        console.log(err.response.status);
        if (err.response.status === 404) {
            console.log('No Such Github username exist!! Please enter a valid github user name');
        }
    }
}

init();