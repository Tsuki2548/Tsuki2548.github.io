'use strict';

const projectsGrid = document.getElementById('projects-grid');
const projectsNotice = document.getElementById('projects-notice');
const username = 'Tsuki2548';

async function fetchProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);

        if (!response.ok) {
            throw new Error('ไม่สามารถเรียกข้อมูลจาก GitHub ได้');
        }

        const repos = await response.json();
        const filtered = repos
            .filter(repo => !repo.fork)
            .filter(repo => repo.description)
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
            .slice(0, 9);

        if (!filtered.length) {
            projectsNotice.textContent = 'ยังไม่มีโปรเจกต์สาธารณะพร้อมคำอธิบาย ลองกลับมาใหม่อีกครั้งเร็ว ๆ นี้!';
            return;
        }

        projectsNotice.remove();

        filtered.forEach(repo => {
            const card = document.createElement('article');
            card.className = 'project-card';

            const title = document.createElement('h3');
            title.textContent = repo.name;

            const description = document.createElement('p');
            description.textContent = repo.description;

            const meta = document.createElement('div');
            meta.className = 'project-meta';
            meta.innerHTML = `<span>อัปเดตล่าสุด: ${new Date(repo.pushed_at).toLocaleDateString('th-TH')}</span><a href="${repo.html_url}" target="_blank" rel="noopener">ดูโค้ด →</a>`;

            const tags = document.createElement('div');
            tags.className = 'project-tags';
            if (repo.language) {
                const langTag = document.createElement('span');
                langTag.className = 'chip';
                langTag.textContent = repo.language;
                tags.appendChild(langTag);
            }

            const topics = repo.topics || [];
            topics.slice(0, 3).forEach(topic => {
                const topicTag = document.createElement('span');
                topicTag.className = 'chip';
                topicTag.textContent = topic;
                tags.appendChild(topicTag);
            });

            card.append(title, description, tags, meta);
            projectsGrid.appendChild(card);
        });
    } catch (error) {
        projectsNotice.textContent = 'เกิดข้อผิดพลาดในการโหลดโปรเจกต์ กรุณาลองใหม่อีกครั้ง';
        console.error(error);
    }
}

function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initYear();
    fetchProjects();
});
