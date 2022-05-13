package com.projects.staybooking.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "stay_image")
public class StayImage implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    private String url;

    @ManyToOne // StayImage是MANY, Stay是one，一个stay可以对应多个stayImage
    @JoinColumn(name = "stay_id") //对应的foreign key，是这张表的第二个column
    @JsonIgnore //前端如果获取一个StayImage的信息，这个字段不作为JSON的返回结果，前端只会获得一个url
    private Stay stay;

    public StayImage() {}

    public StayImage(String url, Stay stay) {
        this.url = url;
        this.stay = stay;
    }

    public String getUrl() {
        return url;
    }

    public StayImage setUrl(String url) {
        this.url = url;
        return this;
    }

    public Stay getStay() {
        return stay;
    }

    public StayImage setStay(Stay stay) {
        this.stay = stay;
        return this;
    }
}

