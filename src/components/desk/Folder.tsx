import { cn } from '@/lib/utils';
import { ProjectCover } from '@/components/fx';
import type { Project } from '@/lib/data';

/**
 * A desktop folder. Three sheets peek out of it — the top one is the project's own artwork —
 * and on hover (of the nearest `group/folder`) the sheets fan upward while the flap tips open.
 */
export const Folder = ({ project, className }: { project: Project; className?: string }) => (
  <div className={cn('group/folder relative aspect-[5/4] w-full select-none', className)}>
    {/* back panel + tab */}
    <div className="absolute inset-x-0 bottom-0 top-[9%] rounded-[8%/10%] bg-gradient-to-b from-[#b4b9ab] to-[#8d9285] shadow-[0_22px_34px_-14px_rgba(0,0,0,0.65)]" />
    <div className="absolute left-0 top-[2%] h-[14%] w-[40%] rounded-t-[26%/70%] bg-[#b4b9ab]" />

    {/* sheets */}
    <div className="absolute inset-x-[9%] bottom-[17%] h-[68%] origin-bottom -rotate-[7deg] rounded-md bg-[#dfe2d8] shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/folder:-translate-y-[22%] group-hover/folder:-rotate-[13deg]" />
    <div
      className="absolute inset-x-[9%] bottom-[17%] h-[68%] origin-bottom rotate-[4deg] rounded-md bg-[#f6f7f2] shadow-sm transition-transform delay-[40ms] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/folder:-translate-y-[30%] group-hover/folder:rotate-[9deg]"
      style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0 9px, rgb(0 0 0 / 0.07) 9px 10px)' }}
    />
    <div className="absolute inset-x-[9%] bottom-[17%] h-[68%] origin-bottom -rotate-[1.5deg] overflow-hidden rounded-md shadow-md ring-1 ring-black/10 transition-transform delay-[80ms] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/folder:-translate-y-[40%] group-hover/folder:rotate-[1deg] group-hover/folder:scale-[1.04]">
      <ProjectCover kind={project.cover} hue={project.hue} hue2={project.hue2} image={project.image} alt="" />
    </div>

    {/* front flap */}
    <div
      className="absolute inset-x-0 bottom-0 h-[54%] origin-bottom rounded-[9%/14%] bg-gradient-to-b from-[#f4f6ef] to-[#cfd3c7] shadow-[0_-6px_18px_-8px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/folder:[transform:perspective(520px)_rotateX(-15deg)]"
    />
  </div>
);

export default Folder;
