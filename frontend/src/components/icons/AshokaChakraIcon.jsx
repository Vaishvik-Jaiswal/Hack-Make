const AshokaChakraIcon = ({ size = 48, color = '#1a237e' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Ashoka Chakra"
  >
    <circle cx="256" cy="256" r="240" fill="none" stroke={color} strokeWidth="32"/>
    {[...Array(24)].map((_, i) => (
      <line
        key={i}
        x1="256"
        y1="256"
        x2="256"
        y2="40"
        stroke={color}
        strokeWidth="16"
        transform={`rotate(${(360 / 24) * i} 256 256)`}
      />
    ))}
    <circle cx="256" cy="256" r="24" />
  </svg>
);

export default AshokaChakraIcon;
