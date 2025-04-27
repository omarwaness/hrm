import React from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import Footer from "./Footer";

export default function AboutUsComponent() {
  const teamMembers = [
    {name: "Omar Salah Eldine Wannes", role:"Project Manager",
        image:"/images/OmarImage.jpg", contact:"https://github.com/omarwaness",
    },
    { name: "Ahmed Khalil Omrani",role: "Software Developer",
      image: "/images/AhmedImage.jpg",contact: "https://github.com/ahmed-khalil-omrani",
    },
    {
      name: "Ayoub Lani",role: "Software Developer",
      image: "/images/AyoubImage.jpg",contact: "https://github.com/LaniAyoub",
    },
    {
      name: "Mouadh Aboubaker Waness",role: "Software Developer",
      image: "/images/MouadhImage.jpg",contact: "https://github.com/omarwaness/hrm",
    },
    {
      name: "Youssef Zammit Chatti", role: "Software Developer",
      image: "/images/YoussefImage.jpg",contact: "https://github.com/Youssef-zammit",
    },
    {
      name: "Ghassen Ibrahim",role: "Software Developer",image: "/images/GhassenImage.jpg", contact:'https://github.com/Ghassen908'
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-center mb-6">About Our Team</h1>
          <p className="text-center text-lg max-w-3xl mx-auto text-muted-foreground">
            We are a passionate team of developers committed to delivering exceptional
            software solutions that make a difference. Meet the talented individuals who
            make it all happen!
          </p>
        </header>

        <div className="mb-16 rounded-xl overflow-hidden shadow-xl">
        <img
  src="https://videos.openai.com/vg-assets/assets%2Ftask_01jreehgqdewnt0nm5sk8y03as%2Fimg_0.webp?st=2025-04-09T21%3A59%3A02Z&se=2025-04-15T22%3A59%3A02Z&sks=b&skt=2025-04-09T21%3A59%3A02Z&ske=2025-04-15T22%3A59%3A02Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=S1K8FVDS5xlD%2BXYddDYnonH8lGl9s%2BcLzEvzOv7BHss%3D&az=oaivgprodscus"
  alt="Our Team Collaboration"
  className="w-full h-64 md:h-96 object-contain"
/>

        </div>

    
        <div className="mb-16 bg-card border border-border rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-center">Our Mission</h2>
          <p className="text-center">
            At the heart of our team's philosophy is a commitment to innovation and excellence.
            We leverage our diverse skill sets and expertise to create robust, scalable solutions
            that address real-world challenges. <strong>Keep going JN</strong> is more than just our motto;
            it represents our dedication to persistent improvement and growth. Special thanks to our leader MarMar; no one will read this. 
          </p>
        </div>

        
        <h2 className="text-2xl font-semibold mb-6 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="bg-card border border-border shadow-md rounded-lg overflow-hidden">
              <div className="p-6 flex flex-col sm:flex-row items-center gap-4">
               
                <div className="w-32 h-32 shrink-0 rounded-full bg-muted overflow-hidden border-2 border-primary/20 shadow-md">
                  <img src={member.image}alt={member.name}className="w-full h-full object-cover" />
                </div>

                
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                  {member.contact && (
                    <Link to={member.contact}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors text-sm"
                    >
                      <Github size={16} />
                      <span>GitHub Profile</span>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Footer />

      </div>
    </div>
  );
}