package kb.user.internal.config;// kb/user/internal/security/jwt/JwtAuthentication.java


import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
/**
 * 시큐리티 인증 Jwt로 커스텀
 * @since JDK21
 * @author 채기훈
 */
public class JwtAuthentication implements Authentication {
    private final String token;
    private final String principal;
    private final Collection<? extends GrantedAuthority> authorities;
    private boolean authenticated = true;

    public JwtAuthentication(String token, String principal, Collection<? extends GrantedAuthority> authorities) {
        this.token = token;
        this.principal = principal;
        this.authorities = authorities;
    }


    public String getToken() {
        return token;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public Object getCredentials() {
        return token;
    }

    @Override
    public Object getDetails() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }

    @Override
    public boolean isAuthenticated() {
        return authenticated;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        this.authenticated = isAuthenticated;
    }

    @Override
    public String getName() {
        return principal;
    }
}
