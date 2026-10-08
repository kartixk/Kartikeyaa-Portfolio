import {
  User, MapPin, Mail, Phone, Github, Linkedin,
  Globe, Cpu, Server, GraduationCap, Briefcase, Code2, Rocket,
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import PageHeader from '@/components/PageHeader';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Reveal, TiltCard, Magnetic } from '@/components/fx';

const timeline = [
  { year: 'Dec 2025 — Present', title: 'Software Developer Intern · Spotmies LLP', description: 'Building and maintaining scalable web applications with the core dev team.', icon: Briefcase },
  { year: '2025', title: 'Software Engineer Intern', description: 'Interned at NTPC Limited & Zenith-Zap — shipped features used by real users.', icon: Briefcase },
  { year: '2025', title: 'AI-ML Virtual Internship', description: 'Explored ML foundations & NLP through the EduSkills virtual internship.', icon: Code2 },
  { year: '2024', title: 'MERN Full Stack Training', description: 'Intensive training at XceedIQ Innovate360 — built production-ready apps end to end.', icon: Code2 },
  { year: '2022', title: 'Started B.Tech · GITAM University', description: 'Computer Science Engineering specializing in IoT.', icon: GraduationCap },
  { year: '2020', title: 'Senior Secondary', description: 'Sri Chaitanya Junior College — PCM. Developed a strong interest in computing.', icon: GraduationCap },
];

const specializations = [
  { label: 'MERN Stack Development', icon: Globe },
  { label: 'API & Backend Engineering', icon: Server },
  { label: 'IoT & Real-time Systems', icon: Cpu },
  { label: 'Clean, Usable Interfaces', icon: Code2 },
];

const interests = [
  { title: 'Web Development', description: 'Building modern, responsive web applications with React and Node.js.', icon: Globe },
  { title: 'IoT Systems', description: 'Developing real-time sensor monitoring and data acquisition systems.', icon: Cpu },
  { title: 'Scalable Systems', description: 'Designing multi-tenant architectures and optimized backend services.', icon: Rocket },
  { title: 'Learning AI / ML', description: 'Exploring ML concepts through internships and personal projects.', icon: Code2 },
];

const softSkills = ['Problem Solving', 'Team Collaboration', 'Time Management', 'Adaptability'];

const About = () => {
  return (
    <PageTransition>
      <div className="gradient-bg">
        <PageHeader
          eyebrow="About Me"
          title={
            <>
              <span className="gradient-text">Crafting</span> <span className="text-foreground">reliable</span>
              <br />
              <span className="text-outline">software</span> <span className="aurora-text italic">from scratch.</span>
            </>
          }
          subtitle="Computer Science undergraduate at GITAM University. I turn ideas into production-ready applications — MERN stack first, clean architecture always."
        />

        {/* ── BIO BENTO ── */}
        <section className="section-container !pt-4">
          <div className="grid gap-5 md:grid-cols-5">
            {/* Bio */}
            <Reveal className="md:col-span-3">
              <div className="group relative h-full rounded-3xl border-[0.75px] border-border p-2">
                <GlowingEffect spread={44} glow disabled={false} proximity={70} inactiveZone={0.01} borderWidth={3} />
                <TiltCard intensity={4} className="h-full overflow-hidden rounded-2xl glass-panel p-8">
                  <div className="mb-7 flex items-center gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-brand-1/25 bg-brand-1/15">
                      <User className="text-brand-1" size={22} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold leading-tight">B Venkata Sai Kartikeya</h3>
                      <p className="mt-0.5 text-xs font-medium tracking-wide text-brand-2">Full Stack MERN Developer · IoT Enthusiast</p>
                    </div>
                  </div>
                  <p className="mb-3 leading-relaxed text-muted-foreground">
                    I enjoy taking ideas from a simple sketch to a reliable, production-ready application.
                    My recent work lives in the MERN stack and real-time IoT monitoring systems.
                  </p>
                  <p className="mb-7 leading-relaxed text-muted-foreground">
                    I care about clear architecture, maintainable code, and smooth user experiences
                    more than chasing every new buzzword.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Magnetic strength={0.3}>
                      <a href="https://github.com/kartixk" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-line/10 bg-line/[0.03] px-4 py-2 text-sm font-medium transition-colors hover:border-brand-2/40 hover:text-brand-2">
                        <Github size={15} /> GitHub
                      </a>
                    </Magnetic>
                    <Magnetic strength={0.3}>
                      <a href="https://linkedin.com/in/b-venkata-sai-kartikeya-28a99b357" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-brand-1/30 bg-brand-1/10 px-4 py-2 text-sm font-medium text-brand-1 transition-colors hover:bg-brand-1/20">
                        <Linkedin size={15} /> LinkedIn
                      </a>
                    </Magnetic>
                    <Magnetic strength={0.3}>
                      <a href="https://mail.google.com/mail/?view=cm&fs=1&to=kartikeyaa15@gmail.com" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-line/10 bg-line/[0.03] px-4 py-2 text-sm font-medium transition-colors hover:border-brand-3/40 hover:text-brand-3">
                        <Mail size={15} /> Email
                      </a>
                    </Magnetic>
                  </div>
                </TiltCard>
              </div>
            </Reveal>

            {/* Info + soft skills */}
            <Reveal delay={0.1} className="md:col-span-2">
              <div className="flex h-full flex-col gap-5">
                <div className="relative rounded-3xl border-[0.75px] border-border p-2">
                  <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                  <div className="relative rounded-2xl glass-panel p-6">
                    <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Quick Info</h3>
                    <div className="space-y-3.5">
                      {[
                        { Icon: MapPin, text: 'Visakhapatnam, India' },
                        { Icon: Mail, text: 'kartikeyaa15@gmail.com' },
                        { Icon: Phone, text: '+91-8250977949' },
                        { Icon: GraduationCap, text: 'GITAM University · B.Tech CSE' },
                      ].map(({ Icon, text }) => (
                        <div key={text} className="flex items-start gap-3">
                          <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-2/10">
                            <Icon className="text-brand-2" size={13} />
                          </div>
                          <span className="text-sm leading-snug text-muted-foreground">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative flex-1 rounded-3xl border-[0.75px] border-border p-2">
                  <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                  <div className="relative h-full rounded-2xl glass-panel p-6">
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Soft Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {softSkills.map((s) => (
                        <span key={s} className="rounded-full border border-brand-1/20 bg-brand-1/10 px-3 py-1.5 text-xs font-medium text-brand-1">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── SPECIALIZATIONS ── */}
        <section className="section-container">
          <Reveal className="mb-10 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">What I Specialize In</h2>
            <span className="h-px flex-1 bg-border" />
          </Reveal>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {specializations.map(({ label, icon: Icon }, i) => (
              <Reveal key={label} delay={i * 0.08}>
                <div className="group relative h-full rounded-3xl border-[0.75px] border-border p-2">
                  <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                  <TiltCard intensity={8} className="h-full rounded-2xl glass-panel p-6 text-center">
                    <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-brand-2/20 bg-brand-2/10 transition-all duration-300 group-hover:scale-110 group-hover:border-brand-2/40">
                      <Icon className="text-brand-2" size={20} />
                    </div>
                    <p className="text-sm font-semibold leading-snug text-foreground">{label}</p>
                  </TiltCard>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section className="section-container">
          <Reveal className="mb-14 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">My Journey</h2>
            <span className="h-px flex-1 bg-border" />
          </Reveal>

          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent md:left-1/2 md:-translate-x-1/2" />
            {timeline.map((item, i) => {
              const Icon = item.icon;
              const isLeft = i % 2 === 0;
              return (
                <Reveal
                  key={i}
                  delay={i * 0.05}
                  direction={isLeft ? 'right' : 'left'}
                  className={`relative mb-10 flex items-start pl-12 md:mb-14 md:pl-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="absolute left-0 top-3 z-10 grid h-8 w-8 -translate-x-0 place-items-center rounded-full border-2 border-brand-1 bg-background shadow-[0_0_14px_hsl(var(--brand-1)/0.5)] md:left-1/2 md:-translate-x-1/2">
                    <Icon className="text-brand-1" size={13} />
                  </div>
                  <div className={`md:w-[calc(50%-2.5rem)] ${isLeft ? 'md:mr-auto md:pr-6' : 'md:ml-auto md:pl-6'}`}>
                    <div className="relative rounded-2xl border-[0.75px] border-border p-1.5">
                      <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                      <div className="relative rounded-xl glass-panel p-5 transition-colors hover:border-brand-2/30">
                        <span className="inline-flex items-center rounded-full border border-brand-1/20 bg-brand-1/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-brand-1">
                          {item.year}
                        </span>
                        <h4 className="mt-2 font-display text-sm font-bold leading-snug">{item.title}</h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ── INTERESTS ── */}
        <section className="section-container">
          <Reveal className="mb-10 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Areas of Interest</h2>
            <span className="h-px flex-1 bg-border" />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {interests.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={i * 0.08}>
                  <div className="group relative h-full rounded-3xl border-[0.75px] border-border p-2">
                    <GlowingEffect spread={44} glow disabled={false} proximity={70} inactiveZone={0.01} borderWidth={3} />
                    <div className="relative flex h-full items-start gap-4 rounded-2xl glass-panel p-7">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-brand-2/20 bg-brand-2/10 transition-all duration-300 group-hover:scale-110 group-hover:border-brand-2/40">
                        <Icon className="text-brand-2" size={20} />
                      </div>
                      <div>
                        <h4 className="font-display font-bold transition-colors group-hover:text-brand-2">{item.title}</h4>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default About;
