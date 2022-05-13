package com.projects.staybooking.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "stay_reserved_date")
public class StayReservedDate implements Serializable {

    private static final long serialVersionUID = 1L;

    @EmbeddedId
    private StayReservedDateKey id; //composite primary key

    @MapsId("stay_id") //用当前这列去自动map到另一张表的"stay_id"
    @ManyToOne
    private Stay stay; //加stay进来为了检查所有ID必须在stay表中stay_id, 作为stay的一个foreign key


    public StayReservedDate() {}

    public StayReservedDate(StayReservedDateKey id, Stay stay) {
        this.id = id;
        this.stay = stay;
    }

    public StayReservedDateKey getId() {
        return id;
    }

    public Stay getStay() {
        return stay;
    }
}
