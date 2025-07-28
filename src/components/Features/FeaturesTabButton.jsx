import { useState } from "react";
import './FeaturesTabButton.css'

export default function FeaturesTabButton({alt, defaultImg, hoverImg, activeImg, isActive, onClick}) {
    const [isHovered, setIsHovered] = useState(false);

    const getImage = () => {
        if (isActive) return activeImg;
        if (isHovered) return hoverImg;
        return defaultImg
    };

    return (
        <img src={getImage()}
            alt={alt} 
            className="features-tab-button"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        />
    )
}