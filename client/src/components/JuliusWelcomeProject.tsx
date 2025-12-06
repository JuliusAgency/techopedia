import BubbleMenu from './BubbleMenu';

export default function JuliusWelcomeProject() {
  const menuItems = [
    {
      label: 'we',
      href: '/we',
      ariaLabel: 'We',
      rotation: -8,
      hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
    },
    {
      label: 'are',
      href: '/are',
      ariaLabel: 'Are',
      rotation: 8,
      hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
    },
    {
      label: 'Julius:)',
      href: '/Julius:)',
      ariaLabel: 'Julius',
      rotation: 8,
      hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
    }
  ];

  return (
    <div style={{ position: 'fixed', bottom: '2em', right: '2em', zIndex: 1000 }}>
      <BubbleMenu
        logo={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.8"/>
            <circle cx="12" cy="12" r="6" fill="white"/>
          </svg>
        }
        items={menuItems}
        useFixedPosition={true}
        menuBg="#fff"
        menuContentColor="#111"
      />
    </div>
  );
}

