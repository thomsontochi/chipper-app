# Senior Fullstack Developer Test

Welcome, developer!

This repository contains the front-end application of _Chipper_, a fictional microblogging platform. If you've reached this point, it means you've completed the tasks related to the API. Now, let's move on to working on the front-end.

# Preparation

Take some time to familiarize yourself with the codebase.

1. Fork this repository and make sure it's public.


3. Follow these steps to set up your local development environment:

   - Start your Laravel application by running `php artisan serve`.
   - Navigate to the root of the Nuxt application.
   - Install the dependencies by running `yarn install`.
   - Duplicate the `.env.example` file and save it as `.env`. Edit the `API_URL` to match the URL of your local Laravel application. By default, it should be `http://localhost:8000/api`.
   - Initiate the Nuxt development process by running `yarn dev`.

Once you're ready, proceed to address the following tasks one by one.

# Tasks

<img src="https://i.imgur.com/gDGhQw9.png" height="200px">

## 1. Add the ability for users to create posts

The component `PostForm` currently has markup but lacks functionality. Your mission is to integrate it with the API. After creating a post, the form should be cleared.

Please adhere to the app's conventions for making HTTP requests.

You are encouraged to use [Pinia](https://pinia.vuejs.org/) as store for posts.

✋ **BEFORE YOU BEGIN**

> Please update the following line in this `README.md` file to include your estimate of the time required for completion.

Estimated Time Required: 1 hour

> After updating the estimate and right before you start coding, commit your changes using the following command:
`git add README.md && git commit -m "Task 1 estimated" && git push`

🏁 **ONCE YOU HAVE COMPLETED THE TASK**

> After implementing the changes, commit your work using the following commands:
`git add -A && git commit -m "Add the ability for users to create posts" && git push`

## 2. Add the ability for users to favorite users

When a logged-in user clicks the "Follow" button next to the name of a post author, they should be added to the list of their favorite users. In other words, this action corresponds to a `POST` request to `users/{user}/favorite`.

The button label should then change to "Unfollow". If the user clicks it, the post author should be removed from their list of favorite users. In other words, this action corresponds to a `DELETE` request to `users/{user}/favorite`.

Whenever the user reloads the page or logs out and logs back in again, the buttons should display either "Follow" or "Unfollow" and perform the respective actions accordingly. To achieve this functionality, you should depend on the favorites payload provided by the API.

You are encouraged to use [Pinia](https://pinia.vuejs.org/) as store for favorites.

✋ **BEFORE YOU BEGIN**

> Please update the following line in this `README.md` file to include your estimate of the time required for completion.

Estimated Time Required: 45 minutes

> After updating the estimate and right before you start coding, commit your changes using the following command:
`git add README.md && git commit -m "Task 2 estimated" && git push`

🏁 **ONCE YOU HAVE COMPLETED THE TASK**

> After implementing the changes, commit your work using the following commands:
`git add -A && git commit -m "Add the ability for users to favorite users" && git push`

## 3. Add the ability for users to favorite posts

This task is similar to the previous one, but it applies to posts. When a logged-in user clicks "Add to my favorites," the post should be included in their list of favorites, and the label should change to "Remove from favorites." You are welcome to apply styling to differentiate clearly between these two states.

After the user refreshes the page or logs in again following a logout, the favorite posts should be presented accordingly, reflecting the user's previous selections.

✋ **BEFORE YOU BEGIN**

> Please update the following line in this `README.md` file to include your estimate of the time required for completion.

Estimated Time Required: 45 minutes

> After updating the estimate and right before you start coding, commit your changes using the following command:
`git add README.md && git commit -m "Task 3 estimated" && git push`

🏁 **ONCE YOU HAVE COMPLETED THE TASK**

> After implementing the changes, commit your work using the following commands:
`git add -A && git commit -m "Add the ability for users to favorite posts" && git push`

## 4. Poll posts from the API each 30 seconds

Currently, the posts are loaded only once during the page load, and there is no mechanism in place to retrieve new posts without resorting to refreshing the page.

Your objective is to incorporate a new button labeled "Load New Posts" at the top of the post list. When this button is clicked, the latest posts should be appended to the existing list.

The app should check for new posts every 30 seconds. The "Load New Posts" button should only become visible if there are indeed new posts available to be displayed.

Each loaded post should display "Follow" or "Unfollow" appropriately next to the post author's name.

✋ **BEFORE YOU BEGIN**

> Please update the following line in this `README.md` file to include your estimate of the time required for completion.

Estimated Time Required: 45 minutes

> After updating the estimate and right before you start coding, commit your changes using the following command:
`git add README.md && git commit -m "Task 4 estimated" && git push`

🏁 **ONCE YOU HAVE COMPLETED THE TASK**

> After implementing the changes, commit your work using the following commands:
`git add -A && git commit -m "Poll posts from the API each 30 seconds" && git push`

## EXTRA CREDIT: Add the ability to post images

This is an _optional task_. We would appreciate it if you could take the opportunity to code it, especially if you have already completed the extra task involving the API. However, there is no pressure to do so.

The goal is to enable users to attach an image when creating a post. You can achieve this by adding an `<input type="file" accept="image/*" />` element within the form. If necessary, please feel free to make updates to the `$api` plugin.

Posts that include an image should be display it below the body of the post and above the "Add to favorites" button.

✋ **BEFORE YOU BEGIN**

> Please update the following line in this `README.md` file to include your estimate of the time required for completion.

Estimated Time Required: 60 minutes

> After updating the estimate and right before you start coding, commit your changes using the following command:
`git add README.md && git commit -m "Extra Task estimated" && git push`

🏁 **ONCE YOU HAVE COMPLETED THE TASK**

> After implementing the changes, commit your work using the following commands:
`git add -A && git commit -m "Add the ability to post images" && git push`

# Image uploads – flow, validation, and testing

To help reviewers understand the extra credit work, here’s a quick reference:

1. **How to upload:** On the homepage, authenticated users can use the new “Attach an image (optional)” area inside `PostForm`. Click “Choose file,” pick a JPG/PNG/GIF/WEBP (≤5 MB), preview it, and post. The preview displays file name/type/size plus a loading shimmer while submitting.
2. **Frontend validation:**  
   - Title required  
   - Body required  
   - Image MIME: jpg, jpeg, png, gif, webp  
   - Image size: ≤ 5 MB  
   Errors surface inline beneath each field and via toast notifications, staying in sync with Laravel’s validation rules.
3. **Testing signal:** Manual verification covered:
   - Successful post with/without image (image appears in the feed with normalized URLs).  
   - Validation failures for missing title/body, unsupported image type, and oversized image.  
   - Backend validation errors (simulated via API) correctly bubble up to the UI.

# Done!

Thank you for completing this challenge. Kindly inform us when you have finished, and we will proceed to review your code. Make sure to add [harlekoy](https://github.com/harlekoy) to the list of collaborators for both your private repositories, including the Laravel API and the Nuxt app.

Best of luck!

