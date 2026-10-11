/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // 커스텀 도메인(workhub-landing.koavio.com) 사용 시 basePath 불필요.
  // GitHub Pages 서브경로(/workhub-landing) 배포였을 때만 필요했던 설정.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
