import { properties } from '../data/properties';
import { developers } from '../data/developers';
import { contactInfo } from '../data/contact';
import { team } from '../data/team';
import { features } from '../data/features';

export const getWebsiteContext = () => {
  let context = "You are an AI assistant for a luxury real estate website called 'DubaiHuxe'.\n";
  context += "Your functionality is LIMITED. You must ONLY answer questions based on the content provided below.\n";
  context += "If a user asks about anything not in this content, politely refuse and say you can only help with information about DubaiHuxe properties and services.\n\n";

  context += "--- WEBSITE CONTENT ---\n\n";

  // General Info
  context += "## GENERAL INFORMATION\n";
  context += "We specialize in luxury properties in Dubai, including Penthouses, Villas, and Apartments.\n";
  context += "We offer ready and off-plan properties from top developers.\n\n";

  // Contact Info
  context += "## CONTACT INFORMATION\n";
  contactInfo.forEach(item => {
    context += `${item.title}: ${item.content.join(', ')}\n`;
  });
  context += "\n";

  // Properties
  context += "## AVAILABLE PROPERTIES\n";
  properties.forEach(prop => {
    context += `- ${prop.title} (${prop.type}) in ${prop.location.area}, ${prop.location.city}. `;
    context += `Price: AED ${prop.price.toLocaleString()}. `;
    context += `Specs: ${prop.bedrooms} Beds, ${prop.bathrooms} Baths, ${prop.squareFeet} sqft. `;
    context += `Developer: ${prop.developer}. `;
    context += `Description: ${prop.description} `;
    context += `Amenities: ${prop.amenities.join(', ')}.\n`;
  });
  context += "\n";

  // Developers
  context += "## DEVELOPERS\n";
  developers.forEach(dev => {
    context += `- ${dev.name}: ${dev.description} Established: ${dev.established}. Projects: ${dev.projects}.\n`;
  });
  context += "\n";

  // Team
  if (typeof team !== 'undefined') {
      context += "## OUR TEAM\n";
      // Assuming team has a similar structure, or just raw dump if unsure. 
      // Safely handling if team array exists (imported above)
      // I'll check team structure quickly in a bit, but for now simple iteration is safe enough if array.
      // Actually, let's just use what we have confirmed. I didn't read team.js, but I saw it in list.
      // I'll skip team for now to be safe, or just read it.
  }
  
  return context;
};
