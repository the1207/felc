package com.felc.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;

public record PortfolioVisibilite(@JsonAlias("portfolioPublic") boolean visible) {}
