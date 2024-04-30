// /backend/models/Post.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const postsPath = path.join(__dirname, '..', '..', 'data', 'posts.json');

class Post {
    constructor({ id, title, content, imagePath }) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.postImagePath = imagePath;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    static async create({ title, content, imagePath }) {
        const posts = JSON.parse(await fs.readFile(postsPath, 'utf8'));
        const id = posts.length + 1;
        const newPost = new Post({ id, title, content, imagePath });
        posts.push(newPost);
        await fs.writeFile(postsPath, JSON.stringify(posts, null, 2), 'utf8');
        return newPost;
    }

    static async nextId() {
        const posts = await this.findAll();
        const lastPost = posts[posts.length - 1];
        return lastPost ? lastPost.id + 1 : 1;
    }

    static findAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(postsPath, 'utf8', (err, data) => {
                if (err) {
                    reject(new Error('Error reading posts data'));
                    return;
                }
                try {
                    const posts = JSON.parse(data);
                    resolve(posts);
                } catch (parseErr) {
                    reject(new Error('Error parsing posts data'));
                }
            });
        });
    }

    static findById(postId) {
        return this.findAll().then(posts => posts.find(post => post.id === parseInt(postId)));
    }

    static deleteById(postId) {
        return this.findAll().then(posts => {
            const filteredPosts = posts.filter(post => post.id !== parseInt(postId));
            return new Promise((resolve, reject) => {
                fs.writeFile(postsPath, JSON.stringify(filteredPosts, null, 2), 'utf8', (err) => {
                    if (err) reject(new Error('Error writing posts data'));
                    resolve();
                });
            });
        });
    }

    static updateById(postId, updates) {
        return this.findAll().then(posts => {
            const updatedPosts = posts.map(post => {
                if (post.id === parseInt(postId)) {
                    // 새 이미지가 없으면 기존 이미지 경로를 유지
                    if (!updates.postImagePath && post.postImagePath) {
                        updates.postImagePath = post.postImagePath;
                    }
                    return { ...post, ...updates, updatedAt: new Date().toISOString() };
                }
                return post;
            });
            return new Promise((resolve, reject) => {
                fs.writeFile(postsPath, JSON.stringify(updatedPosts, null, 2), 'utf8', (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    }
    
    
}

export default Post;