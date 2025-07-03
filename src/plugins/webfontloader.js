/**
 * plugins/webfontloader.js
 *
 * Simple Google Fonts loader without external dependencies
 */

export async function loadFonts() {
  try {
    // Create a link element for Google Fonts
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap'
    
    // Add to document head
    document.head.appendChild(link)
    
    console.log('Google Fonts loaded successfully')
  } catch (error) {
    console.error('Failed to load Google Fonts:', error)
  }
}
export default function () {
  loadFonts()
}
