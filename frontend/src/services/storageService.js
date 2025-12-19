import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Firebase Storage Service
 * 
 * This service provides functions for uploading, retrieving, and deleting files
 * from Firebase Storage. It's primarily used for product images, user profile pictures,
 * and vendor documents.
 */

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - The storage path (e.g., 'products/', 'users/')
 * @param {string} fileName - Optional custom filename, if not provided uses file.name
 * @returns {Promise<string>} - The download URL of the uploaded file
 */
export const uploadFile = async (file, path, fileName = null) => {
  try {
    const storageRef = ref(storage, `${path}${fileName || file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('File uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Get the download URL for a file in Firebase Storage
 * @param {string} path - The full storage path to the file
 * @returns {Promise<string>} - The download URL
 */
export const getFileURL = async (path) => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * @param {string} path - The full storage path to the file
 * @returns {Promise<void>}
 */
export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Upload multiple files to Firebase Storage
 * @param {File[]} files - Array of files to upload
 * @param {string} path - The storage path (e.g., 'products/', 'users/')
 * @returns {Promise<string[]>} - Array of download URLs
 */
export const uploadMultipleFiles = async (files, path) => {
  try {
    const uploadPromises = files.map(file => uploadFile(file, path));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
};

/**
 * Generate a unique filename for storage
 * @param {string} originalName - Original filename
 * @returns {string} - Unique filename with timestamp
 */
export const generateUniqueFileName = (originalName) => {
  const timestamp = new Date().getTime();
  const extension = originalName.split('.').pop();
  return `${timestamp}.${extension}`;
};

/**
 * Extract the file path from a Firebase Storage download URL
 * @param {string} downloadURL - The download URL
 * @returns {string} - The storage path
 */
export const getPathFromURL = (downloadURL) => {
  try {
    // Extract the path from the URL
    // Format: https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]?token=[token]
    const urlObj = new URL(downloadURL);
    const path = decodeURIComponent(urlObj.pathname.split('/o/')[1].split('?')[0]);
    return path;
  } catch (error) {
    console.error('Error extracting path from URL:', error);
    return null;
  }
};

export default {
  uploadFile,
  getFileURL,
  deleteFile,
  uploadMultipleFiles,
  generateUniqueFileName,
  getPathFromURL
};