import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Workhub 도움말',
  description: 'Workhub 업무협업 플랫폼 사용자 매뉴얼',
  lang: 'ko-KR',
  base: '/workhub-landing/docs/',

  head: [
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
  ],

  appearance: 'dark',

  themeConfig: {
    siteTitle: 'Workhub 도움말',

    nav: [
      { text: '시작하기', link: '/01-getting-started/' },
      { text: '사용자 가이드', link: '/02-user-guide/' },
      {
        text: '관리자',
        items: [
          { text: '부서관리자', link: '/03-dept-admin-guide/' },
          { text: '기관관리자', link: '/04-org-admin-guide/' },
        ],
      },
      { text: '시스템 구축', link: '/05-deployment-guide/' },
      { text: '개발자 가이드', link: '/06-developer-guide/' },
    ],

    sidebar: {
      '/01-getting-started/': [
        {
          text: '시작하기',
          items: [
            { text: '개요', link: '/01-getting-started/' },
            { text: '로그인 및 첫 접속', link: '/01-getting-started/login' },
            { text: '화면 구성', link: '/01-getting-started/layout' },
            { text: '프로필 설정', link: '/01-getting-started/profile' },
            { text: '알림 설정', link: '/01-getting-started/notifications' },
          ],
        },
      ],
      '/02-user-guide/': [
        {
          text: '사용자 가이드',
          items: [
            { text: '개요', link: '/02-user-guide/' },
            { text: '메시지', link: '/02-user-guide/messaging' },
            { text: '채널', link: '/02-user-guide/channels' },
            { text: 'DM (다이렉트 메시지)', link: '/02-user-guide/dm' },
            { text: '프로젝트', link: '/02-user-guide/projects' },
            { text: '태스크', link: '/02-user-guide/tasks' },
            { text: '파일', link: '/02-user-guide/files' },
            { text: '조직도', link: '/02-user-guide/org-tree' },
            { text: '연락처', link: '/02-user-guide/contacts' },
            { text: '검색', link: '/02-user-guide/search' },
            { text: '봇 사용법', link: '/02-user-guide/bots' },
          ],
        },
      ],
      '/03-dept-admin-guide/': [
        {
          text: '부서관리자 가이드',
          items: [
            { text: '개요', link: '/03-dept-admin-guide/' },
            { text: '구성원 관리', link: '/03-dept-admin-guide/members' },
            { text: '채널 관리', link: '/03-dept-admin-guide/channels' },
            { text: '프로젝트 관리', link: '/03-dept-admin-guide/projects' },
          ],
        },
      ],
      '/04-org-admin-guide/': [
        {
          text: '기관관리자 가이드',
          items: [
            { text: '개요', link: '/04-org-admin-guide/' },
            { text: '사용자 관리', link: '/04-org-admin-guide/users' },
            { text: '부서 관리', link: '/04-org-admin-guide/departments' },
            { text: '봇 관리', link: '/04-org-admin-guide/bots' },
            { text: '조직 설정', link: '/04-org-admin-guide/settings' },
            { text: '보안 설정', link: '/04-org-admin-guide/security' },
            { text: '감사 로그', link: '/04-org-admin-guide/audit' },
          ],
        },
      ],
      '/05-deployment-guide/': [
        {
          text: '시스템 구축 가이드',
          items: [
            { text: '개요', link: '/05-deployment-guide/' },
            { text: '시스템 요구사항', link: '/05-deployment-guide/requirements' },
            { text: 'Docker 배포', link: '/05-deployment-guide/docker' },
            { text: '인프라 구성', link: '/05-deployment-guide/infrastructure' },
            { text: '초기 설정 마법사', link: '/05-deployment-guide/setup-wizard' },
            { text: '모니터링', link: '/05-deployment-guide/monitoring' },
            { text: '백업 및 복구', link: '/05-deployment-guide/backup' },
          ],
        },
      ],
      '/06-developer-guide/': [
        {
          text: '개발자 가이드',
          items: [
            { text: '개요', link: '/06-developer-guide/' },
            { text: 'MCP 서버', link: '/06-developer-guide/mcp-server' },
            { text: 'API 레퍼런스', link: '/06-developer-guide/api-reference' },
            { text: 'TypeScript SDK', link: '/06-developer-guide/sdk-typescript' },
            { text: 'Python SDK', link: '/06-developer-guide/sdk-python' },
            { text: 'Webhook', link: '/06-developer-guide/webhook' },
          ],
        },
      ],
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '검색', buttonAriaLabel: '검색' },
          modal: {
            noResultsText: '검색 결과가 없습니다',
            resetButtonTitle: '초기화',
            footer: { selectText: '선택', navigateText: '이동', closeText: '닫기' },
          },
        },
      },
    },

    outline: {
      label: '목차',
      level: [2, 3],
    },

    docFooter: {
      prev: '이전',
      next: '다음',
    },

    lastUpdated: {
      text: '최종 수정일',
    },

    returnToTopLabel: '맨 위로',
    darkModeSwitchLabel: '테마',
    sidebarMenuLabel: '메뉴',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/getorey/workhub' },
    ],

    footer: {
      message: 'Workhub 업무협업 플랫폼',
      copyright: '© 2026 Workhub. All rights reserved.',
    },
  },
})
