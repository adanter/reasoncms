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

#ifndef INCLUDE_GEM_GLCOPYPIXELS_H_
#define INCLUDE_GEM_GLCOPYPIXELS_H_

#include "GemGLBase.h"

/*
 CLASS
	GEMglCopyPixels
 KEYWORDS
	openGL	0
 DESCRIPTION
	wrapper for the openGL-function
	"glCopyPixels( GLint x, GLint y, GLsizei width, GLsizei height, GLenum type)"
 */

class GEM_EXTERN GEMglCopyPixels : public GemGLBase
{
	CPPEXTERN_HEADER(GEMglCopyPixels, GemGLBase);

	public:
	  // Constructor
	  GEMglCopyPixels (int, t_atom*);	// CON

	protected:
	  // Destructor
	  virtual ~GEMglCopyPixels ();
	  // Do the rendering
	  virtual void	render (GemState *state);

	// variables
	  GLint	x;		// VAR
	  virtual void	xMess(t_float);	// FUN

	  GLint	y;		// VAR
	  virtual void	yMess(t_float);	// FUN

	  GLsizei	width;		// VAR
	  virtual void	widthMess(t_float);	// FUN

	  GLsizei	height;		// VAR
	  virtual void	heightMess(t_float);	// FUN

	  GLenum	type;		// VAR
	  virtual void	typeMess(t_float);	// FUN


	private:

	// we need some inlets
	  t_inlet *m_inlet[5];

	// static member functions
	  static void	 xMessCallback (void*, t_floatarg);
	  static void	 yMessCallback (void*, t_floatarg);
	  static void	 widthMessCallback (void*, t_floatarg);
	  static void	 heightMessCallback (void*, t_floatarg);
	  static void	 typeMessCallback (void*, t_floatarg);
};
#endif // for header file