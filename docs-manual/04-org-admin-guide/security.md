# 보안 설정

기관 관리자는 조직의 보안 정책을 설정합니다.

## 인증 설정

### OIDC 연동

Workhub는 Zitadel 기반의 OIDC(OpenID Connect) 인증을 사용합니다.

| 설정 | 설명 |
|------|------|
| OIDC Issuer URL | 인증 서버 주소 |
| Client ID | OIDC 클라이언트 ID |
| Client Secret | OIDC 클라이언트 시크릿 |
| Redirect URI | 인증 콜백 URL |

### LDAP 연동 (선택)

기존 LDAP/Active Directory와 연동하여 사용자 인증을 통합할 수 있습니다.

| 설정 | 설명 |
|------|------|
| LDAP Server | LDAP 서버 주소 |
| Base DN | 검색 기본 DN |
| Bind DN | 바인드 사용자 DN |
| Bind Password | 바인드 비밀번호 |
| User Filter | 사용자 검색 필터 |

## 세션 관리

| 설정 | 기본값 | 설명 |
|------|--------|------|
| 세션 만료 시간 | 24시간 | 비활동 시 자동 로그아웃 |
| 동시 세션 수 | 제한 없음 | 하나의 계정으로 동시 접속 수 제한 |

## 접근 제어

### IP 화이트리스트

특정 IP 대역에서만 접속을 허용합니다.

1. 관리 > 보안 설정 > **IP 화이트리스트**
2. 허용할 IP 또는 CIDR 대역을 추가합니다.
3. 목록 외의 IP에서는 접속이 차단됩니다.
