package net.wuxianjie.web.demo.apicall;

public record ApiCallResponse<E>(int httpStatus, E data) {}
