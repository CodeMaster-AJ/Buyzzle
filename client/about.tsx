import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const teamMembers = [
    {
      name: "Amandeep Singh Jadhav",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      description: "Visionary entrepreneur passionate about revolutionizing e-commerce through innovative technology and user-centric design.",
      social: {
        linkedin: "#",
        twitter: "#", 
        github: "#"
      }
    },
    {
      name: "Jitendra Singh Rajput",
      role: "Mentor & Advisor",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      description: "Experienced mentor from University Incubation Centre providing strategic guidance and industry insights to support our journey from concept to market success.",
      isMentor: true,
      social: {
        linkedin: "#",
        email: "#"
      }
    },
    {
      name: "Sarah Chen",
      role: "Technical Lead",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      description: "Full-stack developer specializing in modern web technologies and scalable e-commerce solutions.",
      social: {
        linkedin: "#",
        github: "#"
      }
    },
    {
      name: "Michael Rodriguez", 
      role: "Product Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      description: "Strategic product development expert focused on user experience and market growth.",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ];

  const achievements = [
    {
      icon: "fas fa-check-circle",
      text: "Mentorship from industry experts"
    },
    {
      icon: "fas fa-check-circle", 
      text: "Access to cutting-edge technology"
    },
    {
      icon: "fas fa-check-circle",
      text: "Business development support" 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 fade-in">
        <h1 className="text-4xl font-bold mb-6">About Buyzzle & TEAM AJ</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Born from innovation and student entrepreneurship, Buyzzle represents the future of e-commerce, 
          developed by passionate students with support from our University Incubation Centre.
        </p>
      </div>

      {/* University Partnership */}
      <section className="mb-16">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">University Incubation Centre Partnership</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Our project is proudly supported by the University Incubation Centre, providing us with 
                  mentorship, resources, and the environment to transform innovative ideas into reality.
                </p>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <i className={`${achievement.icon} text-success`}></i>
                      <span>{achievement.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="University incubation center modern facility"
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className={`shadow-lg ${member.isMentor ? 'border-2 border-yellow-400 dark:border-yellow-500' : ''}`}>
              <CardContent className="p-8 text-center">
                <img 
                  src={member.image} 
                  alt={`${member.name} - ${member.role}`}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <Badge className={`mb-4 ${member.isMentor ? 'bg-yellow-500 text-white' : 'bg-primary text-white'}`}>
                  {member.role}
                </Badge>
                {member.isMentor && (
                  <Badge variant="outline" className="mb-4 block bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    University Incubation Centre
                  </Badge>
                )}
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {member.description}
                </p>
                <div className="flex justify-center space-x-4">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-primary transition-colors">
                      <i className="fab fa-linkedin text-xl"></i>
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="text-gray-400 hover:text-primary transition-colors">
                      <i className="fab fa-twitter text-xl"></i>
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} className="text-gray-400 hover:text-primary transition-colors">
                      <i className="fab fa-github text-xl"></i>
                    </a>
                  )}
                  {member.social.email && (
                    <a href={member.social.email} className="text-gray-400 hover:text-primary transition-colors">
                      <i className="fas fa-envelope text-xl"></i>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-8">
        <Card className="gradient-primary text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-blue-100">
              To democratize e-commerce by providing innovative, affordable, and user-friendly solutions 
              that empower businesses of all sizes to thrive in the digital marketplace.
            </p>
          </CardContent>
        </Card>
        
        <Card className="gradient-secondary text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-purple-100">
              To become the leading student-driven e-commerce platform that bridges the gap between 
              traditional retail and cutting-edge technology, fostering innovation and entrepreneurship.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
