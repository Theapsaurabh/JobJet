import axios from "axios";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { tryCatch } from "../utils/TryCatch.js";
import { applicationStatusUpdateTemplate } from "../template.js";
import { publishToTopic } from "../producer.js";

export const createCompany = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
      throw new ErrorHandler("Authentication required", 401);
    }

    if (user.role !== "recruiter") {
      throw new ErrorHandler(
        "Forbidden: Only recuriter can create Company",
        403,
      );
    }
    const { name, description, website } = req.body;
    if (!name || !description || !website) {
      throw new ErrorHandler("All the fields requires", 400);
    }
    const existingCompany = await sql`SELECT company_id FROM companies WHERE 
name= ${name}

 `;
    if (existingCompany.length > 0) {
      throw new ErrorHandler("A company with same name already exists:", 409);
    }
    const file = req.file;
    if (!file) {
      throw new ErrorHandler("Company Logo is required", 400);
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new ErrorHandler("Failed to generate buffer", 500);
    }
    const { data } = await axios.post(
      `${process.env.UPLOAD_SERVICE}/api/utils/upload`,
      { buffet: fileBuffer },
    );
    const [newCompany] = await sql`
    INSERT INTO companies (name, description, website, logo, logo_public_id, recruiter_id) 
    VALUES (${name}, ${description}, ${website}, ${data.url}, ${data.public_id}, ${req.user?.user_id})
    RETURNING *
    
    `;
    res.json({
      message: "Company Created successfully",
      company: newCompany,
    });
  },
);

export const deleteCompany = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    const { companyId } = req.params;
    const [company] = await sql`
    SELECT logo_public_id FROM companies WHERE company_id=${companyId}
    AND recruiter_id=${user?.user_id}

    `;
    if (!company) {
      throw new ErrorHandler(
        "Company not found or you're not authorized to delete",
        404,
      );
    }

    await sql`
DELETE FROM companies WHERE company_id= ${companyId}

`;
    res.json({
      message: "Company and all assiciated jobs have been deleted",
    });
  },
);

export const createJob = tryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;

  if (!user) {
    throw new ErrorHandler("Authentication required", 401);
  }

  if (user.role !== "recruiter") {
    throw new ErrorHandler("Forbidden: Only recruiter can create job", 403);
  }

  const {
    title,
    description,
    salary,
    location,
    role,
    job_type,
    work_location,
    company_id,
    openings,
  } = req.body;

  if (
    !title ||
    !description ||
    !salary ||
    !location ||
    !role ||
    !job_type ||
    !work_location ||
    !company_id ||
    !openings
  ) {
    throw new ErrorHandler("All fields are required", 400);
  }

  const [company] = await sql`
    SELECT company_id
    FROM companies
    WHERE company_id = ${company_id}
      AND recruiter_id = ${user.user_id}
  `;

  if (!company) {
    throw new ErrorHandler("Company not found or unauthorized", 404);
  }

  const [newJob] = await sql`
    INSERT INTO jobs (
      title,
      description,
      salary,
      location,
      role,
      job_type,
      work_location,
      company_id,
      posted_by_recruiter_id,
      openings
    )
    VALUES (
      ${title},
      ${description},
      ${salary},
      ${location},
      ${role},
      ${job_type},
      ${work_location},
      ${company_id},
      ${user.user_id},
      ${openings}
    )
    RETURNING *;
  `;

  res.status(201).json({
    message: "Job posted successfully",
    job: newJob,
  });
});

export const updateJob = tryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;

  if (!user) {
    throw new ErrorHandler("Authentication required", 401);
  }

  if (user.role !== "recruiter") {
    throw new ErrorHandler("Forbidden: Only recruiter can update job", 403);
  }

  const { jobId } = req.params;

  const [existingJob] = await sql`
    SELECT * FROM jobs WHERE job_id = ${jobId}
  `;

  if (!existingJob) {
    throw new ErrorHandler("Job not found", 404);
  }

  if (existingJob.posted_by_recruiter_id !== user.user_id) {
    throw new ErrorHandler("Forbidden: You are not allowed", 403);
  }

  const {
    title,
    description,
    salary,
    location,
    role,
    job_type,
    work_location,
    openings,
    is_active,
  } = req.body;

  const [updatedJob] = await sql`
    UPDATE jobs SET
      title = ${title ?? existingJob.title},
      description = ${description ?? existingJob.description},
      salary = ${salary ?? existingJob.salary},
      location = ${location ?? existingJob.location},
      role = ${role ?? existingJob.role},
      job_type = ${job_type ?? existingJob.job_type},
      work_location = ${work_location ?? existingJob.work_location},
      openings = ${openings ?? existingJob.openings},
      is_active = ${is_active ?? existingJob.is_active}
    WHERE job_id = ${jobId}
    RETURNING *;
  `;

  res.json({
    message: "Job updated successfully",
    job: updatedJob,
  });
});

export const getAllCompany = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const companies = await sql`
  SELECT * FROM companies WHERE recruiter_id= ${req.user?.user_id}

  
  `;
    res.json({
      companies,
    });
  },
);

export const getCompanyDetails = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;

    if (!id) {
      throw new ErrorHandler("Company id is required", 400);
    }

    const [companyData] = await sql`
      SELECT 
        c.*,
        COALESCE(
          (
            SELECT json_agg(j.*)
            FROM jobs j
            WHERE j.company_id = c.company_id
          ),
          '[]'::json
        ) AS jobs
      FROM companies c
      WHERE c.company_id = ${id};
    `;

    if (!companyData) {
      throw new ErrorHandler("Company not found", 404);
    }

    res.json({
      company: companyData,
    });
  },
);

export const getAllActiveJobs = tryCatch(
  async (req, res) => {
    const { title, location } = req.query as {
      title?: string;
      location?: string;
    };

    let queryString = `
      SELECT 
        j.job_id,
        j.title,
        j.description,
        j.salary,
        j.location,
        j.job_type,
        j.role,
        j.work_location,
        j.created_at,
        c.name AS company_name,
        c.logo AS company_logo,
        c.company_id
      FROM jobs j
      JOIN companies c ON j.company_id = c.company_id
      WHERE j.is_active = true
    `;

    const values: any[] = [];
    let paramIndex = 1;

    if (title) {
      queryString += ` AND j.title ILIKE $${paramIndex}`;
      values.push(`%${title}%`);
      paramIndex++;
    }

    if (location) {
      queryString += ` AND j.location ILIKE $${paramIndex}`;
      values.push(`%${location}%`);
      paramIndex++;
    }

    queryString += ` ORDER BY j.created_at DESC`;

    const jobs = await sql.query(queryString, values);

    res.json({
      count: jobs.length,
      jobs
    });
  }
);

export const getSingleJob= tryCatch(
  async(req, res)=>{
    const [job]= await sql`
    SELECT * FROM jobs WHERE job_id= ${req.params.jobId}`;
    res.json({
      job
    })

  }
)

export const getAllApplicationForJob = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
      throw new ErrorHandler("Authentication required", 401);
    }

    if (user.role !== "recruiter") {
      throw new ErrorHandler("Forbidden: Only recruiter can access this", 403);
    }

    //  extract only jobId
    const jobId = Number(req.params.jobId);

    if (isNaN(jobId)) {
      throw new ErrorHandler("Invalid Job ID", 400);
    }

    const [job] = await sql`
      SELECT posted_by_recruiter_id
      FROM jobs
      WHERE job_id = ${jobId}
    `;

    if (!job) {
      throw new ErrorHandler("Job not found", 404);
    }

   
    if (job.posted_by_recruiter_id !== user.user_id) {
      throw new ErrorHandler("Forbidden: You are not allowed", 403);
    }

    const applications = await sql`
      SELECT *
      FROM applications
      WHERE job_id = ${jobId}
      ORDER BY subscribed DESC, applied_at ASC
    `;

    res.json({
      count: applications.length,
      applications
    });
  }
);

export const updateApplications = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
      throw new ErrorHandler("Authentication required", 401);
    }

    if (user.role !== "recruiter") {
      throw new ErrorHandler("Forbidden: Only recruiter can access this", 403);
    }

    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw new ErrorHandler("Invalid application id", 400);
    }

    const { status } = req.body;

    const allowedStatus = ["Submitted", "Rejected", "Hired"];

    if (!status || !allowedStatus.includes(status)) {
      throw new ErrorHandler("Invalid application status", 400);
    }

    const [application] = await sql`
      SELECT * FROM applications 
      WHERE application_id = ${id}
    `;

    if (!application) {
      throw new ErrorHandler("Application not found", 404);
    }

    const [job] = await sql`
      SELECT posted_by_recruiter_id, title 
      FROM jobs 
      WHERE job_id = ${application.job_id}
    `;

    if (!job) {
      throw new ErrorHandler("Job not found", 404);
    }

    if (job.posted_by_recruiter_id !== user.user_id) {
      throw new ErrorHandler("Forbidden: You are not allowed", 403);
    }

    const [updatedApplication] = await sql`
      UPDATE applications 
      SET status = ${status}
      WHERE application_id = ${id}
      RETURNING *;
    `;

    const message = {
      to: application.applicant_email,
      subject: "Application Status Updated",
      html: applicationStatusUpdateTemplate(job.title, status),
    };

    // send as array (your mail service expects array)
    await publishToTopic("send-mail", [message]);

    res.json({
      message: "Application updated successfully",
      application: updatedApplication,
    });
  }
);
