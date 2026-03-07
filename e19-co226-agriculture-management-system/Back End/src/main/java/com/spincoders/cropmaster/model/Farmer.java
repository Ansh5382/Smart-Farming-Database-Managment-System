package com.spincoders.cropmaster.model;

import jakarta.persistence.*;

@Entity
@Table(name = "farmer") // Changed to lowercase to match your SQL table exactly
public class Farmer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "farmerid") // Matches your DB column 'farmerid'
    private int farmerid;

    @Column(name = "nic", unique = true, nullable = false)
    private String nic;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "age")
    private int age;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "experince") // Matches your DB typo 'experince'
    private String experince;

    public Farmer() {
    }

    // Updated Getter and Setter for lowercase 'farmerid'
    public int getFarmerid() {
        return farmerid;
    }

    public void setFarmerid(int farmerid) {
        this.farmerid = farmerid;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getExperince() {
        return experince;
    }

    public void setExperince(String experince) {
        this.experince = experince;
    }
}