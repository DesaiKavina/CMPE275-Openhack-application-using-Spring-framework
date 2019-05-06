package com.example.cmpe275.openhack.controller;


import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.cmpe275.openhack.dao.UserDao;
import com.example.cmpe275.openhack.dao.UserDaoImpl;
import com.example.cmpe275.openhack.entity.Address;
import com.example.cmpe275.openhack.entity.User;

//@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600,allowedHeaders=
//{"Origin", "Content-Type", "Accept"})

@RestController
public class UserController {
	private UserDao userdao;


	public UserController()
	{
		userdao = new UserDaoImpl();
	}
	@GetMapping("/getuser")
	@ResponseBody
	public User getUser(){
		System.out.println("\ngetUSer method called for the User");	
		User user = new User();
		try
		{
			user = userdao.findUserbyID(1);
			if(user==null) 
			{
				//response.setStatus( HttpServletResponse.SC_BAD_REQUEST  );
				return user;
			}
		}
		catch(Exception e)
		{
			if(e.getMessage()!=null)
			{
				//response.setStatus( HttpServletResponse.SC_BAD_REQUEST );
				return user;
			}
		}
		return user;
	}
	
	@PostMapping("/adduser")
	@ResponseBody
	public User addUser(@RequestBody HashMap<String,String> map){
		System.out.println("\n addUser method called for the User");
		System.out.println("User data from post "+ map.get("email") +"maap "+map);
		User user = new User();
		if(map.get("street")!=null || map.get("city")!=null || map.get("state")!=null || map.get("zip")!=null ||map.get("country")!=null) {
			Address address = new Address();
			if(map.get("street")!=null)
				address.setStreet(map.get("street"));
			if(map.get("city")!=null)
				address.setCity(map.get("city"));
			if(map.get("state")!=null)
				address.setState(map.get("state"));
			if(map.get("zip")!=null)
				address.setZip(map.get("zip"));
			if(map.get("country")!=null)
				address.setCountry(map.get("country"));
			user.setAddress(address);
		}
		if(map.get("screenName")!=null)
			user.setScreenName(map.get("screenName"));
		if(map.get("aboutMe")!=null)
			user.setAboutMe(map.get("aboutMe"));
		if(map.get("password")!=null)
			user.setPassword(map.get("password"));
		if(map.get("name")!=null)
			user.setName(map.get("name"));
		if(map.get("email")!=null)
			user.setEmail(map.get("email"));
		if(map.get("title")!=null)
			user.setTitle(map.get("title"));
		
		try {
			user = userdao.create(user);
		}catch (Exception e) {
			System.out.println("Exception while creating a user"+e);
		}
		return user;
	}
	
	@RequestMapping(value="/user/notHackathon", method=RequestMethod.POST)
	@ResponseBody
	public Map<Object,Object> getUsersNotInHackathon(HttpServletRequest request,
			HttpServletResponse response,
			@PathVariable(name="id") long hackathonId){
		
		return null;
	}
}
