# 🌄 Camp

Camp is a **full-stack web application** that allows users to discover, create, rate, and review beautiful campgrounds around the world. With built-in authentication, location mapping, and image upload capabilities, Camp provides a complete platform for campground enthusiasts!

---

## ✨ Features

- 📝 **User Authentication**  
  - Register and log in using Passport.js.
  - Only authenticated users can create/edit/delete campgrounds and reviews.

- 🏕️ **Campground Management**  
  - Create, edit, and delete campgrounds.
  - Upload multiple images per campground using **Cloudinary**.
  - Automatically geocode locations with **Mapbox** and display them on interactive maps.

- 🌍 **Interactive Maps**  
  - Clustered map view of all campgrounds.
  - Each campground has its own location map.

- 💬 **Review System**  
  - Logged-in users can write, update, and delete reviews.
  - Prevent duplicate reviews from the same user.

- ✅ **Validations**
  - Both client-side and server-side input validation.
  - Flash messages for errors and feedback.

- 💾 **Sessions & Cookies**
  - User sessions maintained using cookies for persistent login.

---

## 🛠️ Technologies Used

- **Frontend**: HTML, EJS, CSS, Bootstrap
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js
- **Cloud Services**:
  - Mapbox (Geolocation & Map Display)
  - Cloudinary (Image Uploads)
- **Others**: Express-session, Flash messages, Connect-mongo

---

## 🔐 Authorization Flow

| Action                       | Auth Required | Owner Only |
|-----------------------------|---------------|------------|
| View Campgrounds            | ❌            | ❌         |
| Create Campground           | ✅            | ❌         |
| Edit/Delete Campground      | ✅            | ✅         |
| Write a Review              | ✅            | ❌         |
| Edit/Delete a Review        | ✅            | ✅         |

---


## 🚀 How to Run Locally

```bash
git clone https://github.com/yourusername/Camp.git
cd Camp
npm install
npm run dev
