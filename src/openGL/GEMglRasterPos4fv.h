 /* ------------------------------------------------------------------
  * GEM - Graphics Environment for Multimedia
  *
  *  Copyright (c) 2002 IOhannes m zmoelnig. forum::für::umläute. IEM
  *	zmoelnig@iem.kug.ac.at
  *  For information on usage and redistribution, and for a DISCLAIMER
  *  OF ALL WARRANTIES, see the file, "GEM.LICENSE.TERMS"
  *
  *  this file has been generated...
  * ------------------------------------------------------------------
  */

#ifndef INCLUDE_GEM_GLRASTERPOS4FV_H_
#define INCLUDE_GEM_GLRASTERPOS4FV_H_

#include "GemGLBase.h"

/*
 CLASS
	GEMglRasterPos4fv
 KEYWORDS
	openGL	0
 DESCRIPTION
	wrapper for the openGL-function
	"glRasterPos4fv( GLfloat* v)"
 */

class GEM_EXTERN GEMglRasterPos4fv : public GemGLBase
{
	CPPEXTERN_HEADER(GEMglRasterPos4fv, GemGLBase);

	public:
	  // Constructor
	  GEMglRasterPos4fv (t_float, t_float, t_float, t_float);	// CON
	protected:
	  // Destructor
	  virtual ~GEMglRasterPos4fv ();
	  // Do the rendering
	  virtual void	render (GemState *state);

	// variable
	GLfloat	v[4];		// VAR
	virtual void	vMess(t_float, t_float, t_float, t_float);	// FUN

	private:

	// we need one inlet
	  t_inlet *m_inlet;

	// static member functions
         static void    vMessCallback (void*, t_floatarg, t_floatarg, t_floatarg, t_floatarg);
};
#endif // for header file