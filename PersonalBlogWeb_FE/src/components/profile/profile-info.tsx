"use client";

import { Typography, Card, CardBody, Chip } from "@material-tailwind/react";
import { 
  MapPinIcon, 
  LinkIcon, 
  CalendarIcon,
  AcademicCapIcon,
  BriefcaseIcon 
} from "@heroicons/react/24/outline";

function ProfileInfo() {
  const skills = [
    "React", "Next.js", "TypeScript", "Node.js", "MongoDB", 
    "PostgreSQL", "Tailwind CSS", "GraphQL", "AWS", "Docker"
  ];

  const interests = [
    "Web Development", "Machine Learning", "DevOps", "Open Source", 
    "Technical Writing", "Mobile Development"
  ];

  return (
    <section className="px-8 py-12 bg-gray-50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-4 font-bold">
                  About
                </Typography>
                <Typography variant="paragraph" className="!text-gray-700 leading-relaxed">
                  I&apos;m a passionate full-stack developer with over 5 years of experience building 
                  web applications. I love creating clean, efficient code and sharing my knowledge 
                  with the developer community through technical blogs and open-source contributions.
                </Typography>
                <Typography variant="paragraph" className="!text-gray-700 leading-relaxed mt-4">
                  When I&apos;m not coding, you can find me exploring new technologies, contributing to 
                  open source projects, or writing technical articles to help other developers 
                  grow in their careers.
                </Typography>
              </CardBody>
            </Card>

            {/* Skills Section */}
            <Card className="mb-6">
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-4 font-bold">
                  Skills & Technologies
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Chip
                      key={skill}
                      value={skill}
                      variant="outlined"
                      className="rounded-full"
                    />
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Interests Section */}
            <Card>
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-4 font-bold">
                  Interests
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Chip
                      key={interest}
                      value={interest}
                      color="blue"
                      variant="gradient"
                      className="rounded-full"
                    />
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-4 font-bold">
                  Information
                </Typography>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <BriefcaseIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <Typography variant="small" className="font-medium text-gray-900">
                        Senior Full Stack Developer
                      </Typography>
                      <Typography variant="small" className="text-gray-600">
                        at TechCorp Inc.
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <AcademicCapIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <Typography variant="small" className="font-medium text-gray-900">
                        Computer Science
                      </Typography>
                      <Typography variant="small" className="text-gray-600">
                        Stanford University
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPinIcon className="h-5 w-5 text-gray-600" />
                    <Typography variant="small" className="text-gray-700">
                      San Francisco, CA
                    </Typography>
                  </div>

                  <div className="flex items-center gap-3">
                    <LinkIcon className="h-5 w-5 text-gray-600" />
                    <Typography
                      as="a"
                      href="https://johndoe.dev"
                      variant="small"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      johndoe.dev
                    </Typography>
                  </div>

                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-gray-600" />
                    <Typography variant="small" className="text-gray-700">
                      Joined March 2023
                    </Typography>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Typography variant="h6" color="blue-gray" className="mb-3 font-bold">
                    Contact
                  </Typography>
                  <div className="space-y-2">
                    <Typography variant="small" className="text-gray-700">
                      Email: john@johndoe.dev
                    </Typography>
                    <Typography variant="small" className="text-gray-700">
                      LinkedIn: /in/johndoe
                    </Typography>
                    <Typography variant="small" className="text-gray-700">
                      GitHub: @johndoe
                    </Typography>
                    <Typography variant="small" className="text-gray-700">
                      Twitter: @johndoe_dev
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileInfo;
