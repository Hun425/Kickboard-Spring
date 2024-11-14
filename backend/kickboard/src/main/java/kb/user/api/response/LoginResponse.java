package kb.user.api.response;

/**
 * 로그인 요청 응답을 위한 DTO
 * @since JDK21
 * @author 채기훈
 * @param accessToken
 * @param refreshToken
 * @param role
 * @param area
 */

public record LoginResponse(
        String accessToken,
        String refreshToken,
        String role,
        String area
) {

}
