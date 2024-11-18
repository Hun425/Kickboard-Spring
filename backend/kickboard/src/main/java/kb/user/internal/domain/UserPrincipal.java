package kb.user.internal.domain;

import lombok.Getter;

/**
 * 인증 전용 DTO
 * @since JDK21
 * @author 채기훈
 * @param userId
 * @param email
 * @param role
 * @param location
 */
public record UserPrincipal(Long userId, String email, UserRole role, Location location) {

    public static UserPrincipal from(User user) {
        return new UserPrincipal(user.getUserId(), user.getEmail(), user.getRole(), user.getLocation());
    }
}
