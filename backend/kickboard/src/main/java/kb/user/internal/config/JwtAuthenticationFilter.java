package kb.user.internal.config;// kb/user/internal/security/jwt/JwtAuthenticationFilter.java

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kb.user.internal.config.JwtTokenProvider;
import kb.user.internal.domain.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Jwt 인증 필터
 * @since JDK21
 * @author 채기훈
 */
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = resolveToken(request);

        if (StringUtils.hasText(token) && tokenProvider.validateToken(token)) {
            Authentication authentication = tokenProvider.getAuthentication(token);
            if (authentication instanceof JwtAuthentication) {
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        if (StringUtils.hasText(token) && tokenProvider.validateToken(token)) {
            UserPrincipal userPrincipal = tokenProvider.getUserPrincipal(token);

            if (userPrincipal != null) {
                Authentication authentication =
                        new UsernamePasswordAuthenticationToken(
                                userPrincipal,
                                null,
                                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + userPrincipal.role().name()))
                        );

                SecurityContextHolder.getContext().setAuthentication(authentication);

            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}