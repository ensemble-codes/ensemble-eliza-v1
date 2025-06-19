import fs from 'fs'
import path from 'path'
import { logger } from '@elizaos/core'

/**
 * Recursively gets all files in a directory with the given extension
 *
 * @param {string} dir - Directory to search
 * @param {string[]} extensions - File extensions to look for
 * @returns {string[]} - Array of file paths
 */
function getFilesRecursively(dir: string, extensions: string[]): string[] {
    try {
      const dirents = fs.readdirSync(dir, { withFileTypes: true });
  
      const files = dirents
        .filter((dirent) => !dirent.isDirectory())
        .filter((dirent) => extensions.some((ext) => dirent.name.endsWith(ext)))
        .map((dirent) => path.join(dir, dirent.name));
  
      const folders = dirents
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => path.join(dir, dirent.name));
  
      const subFiles = folders.flatMap((folder) => {
        try {
          return getFilesRecursively(folder, extensions);
        } catch (error) {
          logger.warn(`Error accessing folder ${folder}:`, error);
          return [];
        }
      });
  
      return [...files, ...subFiles];
    } catch (error) {
      logger.warn(`Error reading directory ${dir}:`, error);
      return [];
    }
  }

export function readKnowledge(dir: string) {
    const knowledge = []

    const knowledgePath = path.resolve(dir);

    const files = getFilesRecursively(knowledgePath, ['.md'])

    knowledge.push(...files.map((file) => {
        const content = fs.readFileSync(file, 'utf-8');
        return content
    }))

    return knowledge
}