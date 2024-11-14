package kb.user.internal.config;

import io.jsonwebtoken.Claims;
import kb.user.internal.config.JwtTokenProvider;
import kb.user.internal.domain.Location;
import kb.user.internal.domain.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * 지역(구) 기반 인증
 * @since JDK21
 * @author 채기훈
 */
@Aspect
@Component
@RequiredArgsConstructor
public class LocationAuthAspect {

    @Around("@annotation(LocationAuth)")
    public Object checkLocationAuth(ProceedingJoinPoint joinPoint) throws Throwable {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new AccessDeniedException("인증이 필요합니다.");
        }

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Location userLocation = userPrincipal.location();
        if (userLocation == null) {
            throw new AccessDeniedException("사용자의 구역 정보가 없습니다.");
        }

        // 메서드의 파라미터에서 locationId를 찾아 비교
        Object[] args = joinPoint.getArgs();
        for (Object arg : args) {
            if (arg instanceof Long locationId) {
                if (!(userLocation.getLocationId()==locationId)) {
                    throw new AccessDeniedException("해당 구역에 대한 권한이 없습니다.");
                }
                break;
            }
        }

        return joinPoint.proceed();
    }
}