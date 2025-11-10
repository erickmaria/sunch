import icon from '@/assets/icon.svg'
type Props = {
    size?: number | string;
    color?: string;
    className?: string;
    title?: string;
};


export default function AppIcon({
    size = 24,
    className,
}: Props) {
    return (
        <>
            <div>
                <img 
                className={className} 
                width={size} 
                height={size} 
                src={icon} 
                alt="app icon" />
            </div>
        </>
    );
}
