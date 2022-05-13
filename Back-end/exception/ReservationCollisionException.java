package com.projects.staybooking.exception;

public class ReservationCollisionException extends RuntimeException{
    public ReservationCollisionException(String message){
        super(message);
    }
}
