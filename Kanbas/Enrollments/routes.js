import * as enrollmentsDao from './dao.js';

// In Kanbas/Enrollments/routes.js

export default function EnrollmentsRoutes(app) {
  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
  };
  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
  };
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
    app.post('/api/enrollments', async (req, res) => {
      const { userId, courseId } = req.body;
      await enrollmentsDao.enrollUserInCourse(userId, courseId);
      res.sendStatus(200);
    });
  
    app.delete('/api/enrollments', async (req, res) => {
        const { userId, courseId } = req.body;
        const { enrollments } = Database;
        Database.enrollments = enrollments.filter(
          (enrollment) => enrollment.user !== userId || enrollment.course !== courseId
        );
        res.sendStatus(200);
      });
  
    app.get('/api/enrollments/user/:userId', async (req, res) => {
      const { userId } = req.params;
      const { enrollments }= await enrollmentsDao.findEnrollmentsForUser(userId);
      res.status(200).json(enrollments);
    });

    app.get('/api/courses', async (req, res) => {
        const courses = await coursesDao.findAllCourses();
        res.json(courses);
      });
  }
  
  