import {
  FaXTwitter, FaInstagram, FaTiktok, FaYoutube, FaGithub,
  FaLinkedin, FaFacebook, FaTwitch, FaPinterest, FaReddit,
  FaSpotify, FaSoundcloud, FaBehance, FaDribbble, FaMedium,
  FaPatreon, FaSnapchat,
} from 'react-icons/fa6'
import { SiSubstack } from 'react-icons/si'

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  FaXTwitter, FaInstagram, FaTiktok, FaYoutube, FaGithub,
  FaLinkedin, FaFacebook, FaTwitch, FaPinterest, FaReddit,
  FaSpotify, FaSoundcloud, FaBehance, FaDribbble, FaMedium,
  FaPatreon, FaSnapchat, SiSubstack,
}

export default function SocialIcon({
  iconName,
  size = 20,
  color = '#ffffff',
}: {
  iconName: string
  size?: number
  color?: string
}) {
  const Icon = iconMap[iconName]
  if (!Icon) return null
  return <Icon size={size} color={color} />
}