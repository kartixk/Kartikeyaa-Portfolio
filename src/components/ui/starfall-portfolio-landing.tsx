import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// --- TYPE DEFINITIONS FOR PROPS ---
interface NavLink { label: string; href: string; }
interface Project { title: string; description: string; tags: string[]; imageContent?: React.ReactNode; }
interface Stat { value: string; label: string; }

export interface PortfolioPageProps {
  logo?: { initials: React.ReactNode; name: React.ReactNode; };
  navLinks?: NavLink[];
  resume?: { label: string; onClick?: () => void; };
  hero?: { titleLine1: React.ReactNode; titleLine2Gradient: React.ReactNode; subtitle: React.ReactNode; };
  ctaButtons?: { primary: { label: string; onClick?: () => void; }; secondary: { label: string; onClick?: () => void; }; };
  projects?: Project[];
  stats?: Stat[];
  showAnimatedBackground?: boolean;
}

// --- INTERNAL ANIMATED BACKGROUND COMPONENT ---
const AuroraBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '0';
    renderer.domElement.style.display = 'block';
    currentMount.appendChild(renderer.domElement);
    const material = new THREE.ShaderMaterial({
      uniforms: { iTime: { value: 0 }, iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) } },
      vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        uniform float iTime; uniform vec2 iResolution;
        #define NUM_OCTAVES 3
        float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
        float noise(vec2 p){ vec2 ip=floor(p);vec2 u=fract(p);u=u*u*(3.0-2.0*u);float res=mix(mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);return res*res; }
        float fbm(vec2 x) { float v=0.0;float a=0.3;vec2 shift=vec2(100);mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.50));for(int i=0;i<NUM_OCTAVES;++i){v+=a*noise(x);x=rot*x*2.0+shift;a*=0.5;}return v; }
        void main() {
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          float t = iTime * 0.15;
          vec2 p = uv * 3.0;
          float f = fbm(p + t) + fbm(p * 1.5 - t * 0.5);
          vec3 col1 = vec3(0.02, 0.04, 0.12);
          vec3 col2 = vec3(0.05, 0.15, 0.35);
          vec3 col3 = vec3(0.0, 0.5, 0.8);
          vec3 color = mix(col1, col2, f * 0.8);
          color += col3 * pow(f, 3.0) * 0.3;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));
    let animationFrameId: number;
    const animate = () => { animationFrameId = requestAnimationFrame(animate); material.uniforms.iTime.value += 0.016; renderer.render(scene, camera); };
    const handleResize = () => { renderer.setSize(window.innerWidth, window.innerHeight); material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight); };
    window.addEventListener('resize', handleResize);
    animate();
    return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', handleResize); if (currentMount.contains(renderer.domElement)) currentMount.removeChild(renderer.domElement); renderer.dispose(); material.dispose(); geometry.dispose(); };
  }, []);
  return <div ref={mountRef} />;
};

// --- DEFAULT DATA ---
const defaultData: Required<Omit<PortfolioPageProps, 'showAnimatedBackground'>> = {
  logo: { initials: 'MT', name: 'Meng To' },
  navLinks: [ { label: 'About', href: '#about' }, { label: 'Projects', href: '#projects' }, { label: 'Skills', href: '#skills' } ],
  resume: { label: 'Resume' },
  hero: { titleLine1: 'Creative Developer &', titleLine2Gradient: 'Digital Designer', subtitle: 'I craft beautiful digital experiences through code and design. Specializing in modern web development, UI/UX design, and bringing innovative ideas to life.', },
  ctaButtons: { primary: { label: 'View My Work' }, secondary: { label: 'Get In Touch' }, },
  projects: [ { title: 'FinTech Mobile App', description: 'React Native app with AI-powered financial insights.', tags: ['React Native', 'Node.js'] }, { title: 'Data Visualization Platform', description: 'Interactive dashboard for complex data analysis.', tags: ['D3.js', 'Python'] }, { title: '3D Portfolio Site', description: 'Immersive WebGL experience with 3D elements.', tags: ['Three.js', 'WebGL'] }, ],
  stats: [ { value: '50+', label: 'Projects Completed' }, { value: '5+', label: 'Years Experience' }, { value: '15+', label: 'Happy Clients' }, ],
};

// --- MAIN CUSTOMIZABLE PORTFOLIO COMPONENT ---
const PortfolioPage: React.FC<PortfolioPageProps> = ({
  logo = defaultData.logo,
  navLinks = defaultData.navLinks,
  resume = defaultData.resume,
  hero = defaultData.hero,
  ctaButtons = defaultData.ctaButtons,
  projects = defaultData.projects,
  stats = defaultData.stats,
  showAnimatedBackground = true,
}) => {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {showAnimatedBackground && <AuroraBackground />}
      <div className="relative z-10">
        {/* Navbar */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/30 border-b border-border/50">
          <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm">
                {logo.initials}
              </div>
              <span className="font-heading font-semibold text-lg">{logo.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</a>
              ))}
            </div>
            <button onClick={resume.onClick} className="px-4 py-2 text-sm rounded-full border border-border/80 hover:bg-muted/50 transition-colors">{resume.label}</button>
          </nav>
        </header>

        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold leading-[1.1] tracking-tight mb-8">
              <span className="block">{hero.titleLine1}</span>
              <span className="block gradient-text">{hero.titleLine2Gradient}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">{hero.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mb-24">
            <button onClick={ctaButtons.primary.onClick} className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
              {ctaButtons.primary.label}
            </button>
            <button onClick={ctaButtons.secondary.onClick} className="px-8 py-3 rounded-full border border-border/80 text-foreground hover:bg-muted/50 transition-colors">
              {ctaButtons.secondary.label}
            </button>
          </div>

          {/* Projects */}
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {projects.map((project, index) => (
              <div key={index} className="glass-card glow-border p-1 rounded-2xl group hover:scale-[1.02] transition-transform duration-300">
                <div className="h-48 rounded-xl bg-muted/30 flex items-center justify-center mb-4 overflow-hidden">
                  {project.imageContent}
                </div>
                <div className="px-4 pb-4">
                  <h3 className="font-heading font-semibold text-lg mb-1">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="w-full max-w-3xl mx-auto glass-card rounded-2xl p-8 flex items-center justify-around mb-16">
            {stats.map((stat, index) => (
              <React.Fragment key={index}>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-heading font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
                {index < stats.length - 1 && <div className="w-px h-12 bg-border/50" />}
              </React.Fragment>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export { PortfolioPage };