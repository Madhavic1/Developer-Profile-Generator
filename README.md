# Developer-Profile-Generator
 A command-line application that dynamically generates a PDF profile from a GitHub username. 

## table of contents
  * Introduction / General Information
  * Languages used
  * Installation
  * Launch
  * Sources to read

  ### Introducion (Aim of the project) / General Information:
The aim of this project is to create a command-line application that dynamically generates a PDF profile from a GitHub username. The application will be invoked with the following command:
    node index.js

    The user will be prompted for a favorite color, which will be used as the background color for cards.
    The PDF will be populated with the following:

    * Profile image
    * User name
    * Links to the following:
    * User location via Google Maps
    * User GitHub profile
    * User blog
    * User bio
    * Number of public repositories
    * Number of followers
    * Number of GitHub stars
    * Number of users following

    If the the github user name entered by the user is not valid / existing one , the application throws an error saying :
    'No Such Github username exist!! Please enter a valid github user name' 

#### This application does few Important checks 
* The location icon will not be shown if the location is null from the github response .
* The name of the user will be shown as same as the github username provided , if the name from the github response is null.
* The Blog icon will not be shown if the blog field is null from the github response . 
* The bio will not be shown in the pdf , if its null from the github profile.

  ### Languages used: 
    1. HTML
    2. CSS
    3. JavaScript
    4. Node.js
    5. npm - Node package manager (below packages are installed from npm)
      * axios
      * electron-html-to
      * inquirer
      * electron-prebuilt
    
### APIs used :
    1. Github API(https://api.github.com/users/)
  
  ### Installation:
    1. Prerequesite is to have Node.js installed on your computer
    2. Un-compress the file Developer-Profile-Generator.zip 
    3. Move the directory Developer-Profile-Generator to a source directory(to keep the code away from regular documents)
    4. Open console and open the source directory path and install npm using 'npm init'.
    5. install all the npm packages by using the command 'npm install <package name>'

  ### Launch:
    Execute the command , node index.js . It will create the pdf profile in the source directory.



   ### Sources to read

    To get better knowledge of the languages used in this project , you can refer the below resources.
    * https://www.w3schools.com/
    * https://www.freecodecamp.org/
    * https://www.npmjs.com/

