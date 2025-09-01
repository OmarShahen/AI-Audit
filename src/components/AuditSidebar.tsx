import SidebarHeader from './sidebar/SidebarHeader';
import ProgressOverview from './sidebar/ProgressOverview';
import SectionNavigationItem from './sidebar/SectionNavigationItem';

interface FormSection {
  id: number;
  title: string;
}

interface AuditSidebarProps {
  sections: FormSection[];
  currentSection: number;
  onSectionClick?: (sectionId: number) => void;
}

export default function AuditSidebar({ sections, currentSection, onSectionClick }: AuditSidebarProps) {
  const getSectionStatus = (sectionId: number) => {
    if (sectionId < currentSection) return 'completed';
    if (sectionId === currentSection) return 'current';
    return 'pending';
  };

  return (
    <div className="w-80 sm:w-80 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60 shadow-xl h-full overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8">
        <SidebarHeader />
        
        <ProgressOverview 
          currentSection={currentSection}
          totalSections={sections.length}
        />

        <nav className="space-y-2">
          {sections.map((section, index) => {
            const status = getSectionStatus(section.id);
            const isClickable = onSectionClick && status === 'completed';
            
            return (
              <SectionNavigationItem
                key={section.id}
                section={section}
                status={status}
                isClickable={isClickable}
                onClick={() => onSectionClick?.(section.id)}
                showConnectionLine={index < sections.length - 1}
              />
            );
          })}
        </nav>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-100/50 to-transparent pointer-events-none"></div>
    </div>
  );
}